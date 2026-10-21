import { Op } from 'sequelize';
import { Category } from '../../database/models/Category';
import { AppError } from '../../common/errors/AppError';
import { HttpStatus } from '../../common/constants/httpStatus';
import { buildMeta, getPagination, parseSort } from '../../common/utils/pagination';

export async function createCategory(name: string) {
  return Category.create({ name });
}

export async function listCategories(query: { page?: number; limit?: number; sort?: string; search?: string }) {
  const { page, limit, offset } = getPagination(query);
  const where = query.search ? { name: { [Op.like]: `%${query.search}%` } } : {};
  const { rows, count } = await Category.findAndCountAll({
    where,
    limit,
    offset,
    order: parseSort(query.sort, ['createdAt', 'updatedAt', 'id', 'name']),
  });
  return { data: rows, meta: buildMeta(page, limit, count) };
}

export async function getCategory(id: number) {
  const category = await Category.findByPk(id);
  if (!category) throw new AppError('Category not found', HttpStatus.NOT_FOUND);
  return category;
}

export async function replaceCategory(id: number, name: string) {
  const category = await getCategory(id);
  await category.update({ name });
  return category;
}

export async function patchCategory(id: number, input: { name?: string }) {
  const category = await getCategory(id);
  await category.update(input);
  return category;
}

export async function deleteCategory(id: number) {
  const category = await getCategory(id);
  await category.destroy();
}
