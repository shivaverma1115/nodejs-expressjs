import { Op, Sequelize } from 'sequelize';
import { Post } from '../../database/models/Post';
import { Category } from '../../database/models/Category';
import { AppError } from '../../common/errors/AppError';
import { HttpStatus } from '../../common/constants/httpStatus';
import { UserRole } from '../../common/constants/roles';
import { buildMeta, getPagination, parseSort } from '../../common/utils/pagination';
import { cacheDelByPrefix, cacheGet, cacheSet } from '../../cache/redis';
import { PostDto } from './post.types';

const CACHE_PREFIX = 'posts:';

function toDto(post: Post): PostDto {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    imageUrl: post.imageUrl,
    categoryId: post.categoryId,
    userId: post.userId,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

function assertOwnerOrAdmin(post: Post, user: { id: number; role: UserRole }) {
  if (post.userId !== user.id && user.role !== UserRole.ADMIN) {
    throw new AppError('You cannot modify this post', HttpStatus.FORBIDDEN);
  }
}

async function ensureCategory(categoryId: number) {
  const category = await Category.findByPk(categoryId);
  if (!category) throw new AppError('Category not found', HttpStatus.NOT_FOUND);
}

async function invalidatePostsCache() {
  await cacheDelByPrefix(CACHE_PREFIX);
}

export async function createPost(
  userId: number,
  input: { title: string; content: string; imageUrl?: string | null; categoryId: number },
) {
  await ensureCategory(input.categoryId);
  const post = await Post.create({ ...input, userId, imageUrl: input.imageUrl ?? null });
  await invalidatePostsCache();
  return toDto(post);
}

export async function listPosts(query: {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  categoryId?: number;
  userId?: number;
}) {
  const cacheKey = `${CACHE_PREFIX}list:${JSON.stringify(query)}`;
  const cached = await cacheGet<{ data: PostDto[]; meta: ReturnType<typeof buildMeta> }>(cacheKey);
  if (cached) return cached;

  const { page, limit, offset } = getPagination(query);
  const where: Record<string | symbol, unknown> = {};
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.userId) where.userId = query.userId;
  if (query.search) {
    where[Op.or] = [
      Sequelize.literal(`MATCH (title, content) AGAINST (${Post.sequelize!.escape(query.search)} IN BOOLEAN MODE)`),
      { title: { [Op.like]: `%${query.search}%` } },
    ];
  }

  const { rows, count } = await Post.findAndCountAll({
    where,
    limit,
    offset,
    order: parseSort(query.sort, ['createdAt', 'updatedAt', 'id', 'title']),
    distinct: true,
  });
  const result = { data: rows.map(toDto), meta: buildMeta(page, limit, count) };
  await cacheSet(cacheKey, result, 60);
  return result;
}

export async function getPost(id: number) {
  const cacheKey = `${CACHE_PREFIX}id:${id}`;
  const cached = await cacheGet<PostDto>(cacheKey);
  if (cached) return cached;
  const post = await Post.findByPk(id);
  if (!post) throw new AppError('Post not found', HttpStatus.NOT_FOUND);
  const dto = toDto(post);
  await cacheSet(cacheKey, dto, 60);
  return dto;
}

export async function replacePost(
  id: number,
  user: { id: number; role: UserRole },
  input: { title: string; content: string; imageUrl?: string | null; categoryId: number },
) {
  const post = await Post.findByPk(id);
  if (!post) throw new AppError('Post not found', HttpStatus.NOT_FOUND);
  assertOwnerOrAdmin(post, user);
  await ensureCategory(input.categoryId);
  await post.update({ ...input, imageUrl: input.imageUrl ?? null });
  await invalidatePostsCache();
  return toDto(post);
}

export async function patchPost(
  id: number,
  user: { id: number; role: UserRole },
  input: Partial<{ title: string; content: string; imageUrl: string | null; categoryId: number }>,
) {
  const post = await Post.findByPk(id);
  if (!post) throw new AppError('Post not found', HttpStatus.NOT_FOUND);
  assertOwnerOrAdmin(post, user);
  if (input.categoryId) await ensureCategory(input.categoryId);
  await post.update(input);
  await invalidatePostsCache();
  return toDto(post);
}

export async function deletePost(id: number, user: { id: number; role: UserRole }) {
  const post = await Post.findByPk(id);
  if (!post) throw new AppError('Post not found', HttpStatus.NOT_FOUND);
  assertOwnerOrAdmin(post, user);
  await post.destroy();
  await invalidatePostsCache();
}
