import { Comment } from '../../database/models/Comment';
import { Post } from '../../database/models/Post';
import { AppError } from '../../common/errors/AppError';
import { HttpStatus } from '../../common/constants/httpStatus';
import { UserRole } from '../../common/constants/roles';
import { buildMeta, getPagination, parseSort } from '../../common/utils/pagination';

async function ensurePost(postId: number) {
  const post = await Post.findByPk(postId);
  if (!post) throw new AppError('Post not found', HttpStatus.NOT_FOUND);
}

function assertOwnerOrAdmin(comment: Comment, user: { id: number; role: UserRole }) {
  if (comment.userId !== user.id && user.role !== UserRole.ADMIN) {
    throw new AppError('You cannot modify this comment', HttpStatus.FORBIDDEN);
  }
}

export async function createComment(userId: number, input: { content: string; postId: number }) {
  await ensurePost(input.postId);
  return Comment.create({ ...input, userId });
}

export async function listComments(query: { page?: number; limit?: number; sort?: string; postId?: number; userId?: number }) {
  const { page, limit, offset } = getPagination(query);
  const where: Record<string, unknown> = {};
  if (query.postId) where.postId = query.postId;
  if (query.userId) where.userId = query.userId;
  const { rows, count } = await Comment.findAndCountAll({
    where,
    limit,
    offset,
    order: parseSort(query.sort, ['createdAt', 'updatedAt', 'id']),
  });
  return { data: rows, meta: buildMeta(page, limit, count) };
}

export async function getComment(id: number) {
  const comment = await Comment.findByPk(id);
  if (!comment) throw new AppError('Comment not found', HttpStatus.NOT_FOUND);
  return comment;
}

export async function replaceComment(
  id: number,
  user: { id: number; role: UserRole },
  input: { content: string; postId: number },
) {
  const comment = await getComment(id);
  assertOwnerOrAdmin(comment, user);
  await ensurePost(input.postId);
  await comment.update(input);
  return comment;
}

export async function patchComment(id: number, user: { id: number; role: UserRole }, input: { content?: string }) {
  const comment = await getComment(id);
  assertOwnerOrAdmin(comment, user);
  await comment.update(input);
  return comment;
}

export async function deleteComment(id: number, user: { id: number; role: UserRole }) {
  const comment = await getComment(id);
  assertOwnerOrAdmin(comment, user);
  await comment.destroy();
}
