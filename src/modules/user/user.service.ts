import { Op, WhereOptions } from 'sequelize';
import { User } from '../../database/models/User';
import { AppError } from '../../common/errors/AppError';
import { HttpStatus } from '../../common/constants/httpStatus';
import { buildMeta, getPagination, parseSort } from '../../common/utils/pagination';
import { PublicUser } from './user.types';
import { UserRole } from '../../common/constants/roles';

function toPublic(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
  };
}

export async function getMe(userId: number) {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError('User not found', HttpStatus.NOT_FOUND);
  return toPublic(user);
}

export async function updateMe(userId: number, input: { name?: string }) {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError('User not found', HttpStatus.NOT_FOUND);
  await user.update(input);
  return toPublic(user);
}

export async function listUsers(query: { page?: number; limit?: number; sort?: string; search?: string; role?: UserRole }) {
  const { page, limit, offset } = getPagination(query);
  const where: WhereOptions = {};
  if (query.role) Object.assign(where, { role: query.role });
  if (query.search) {
    Object.assign(where, {
      [Op.or]: [{ name: { [Op.like]: `%${query.search}%` } }, { email: { [Op.like]: `%${query.search}%` } }],
    });
  }
  const { rows, count } = await User.findAndCountAll({
    where,
    limit,
    offset,
    order: parseSort(query.sort, ['createdAt', 'updatedAt', 'id', 'name']),
  });
  return { data: rows.map(toPublic), meta: buildMeta(page, limit, count) };
}

export async function adminUpdateUser(
  id: number,
  input: { name?: string; role?: UserRole; isEmailVerified?: boolean },
) {
  const user = await User.findByPk(id);
  if (!user) throw new AppError('User not found', HttpStatus.NOT_FOUND);
  await user.update(input);
  return toPublic(user);
}

export async function adminDeleteUser(id: number) {
  const user = await User.findByPk(id);
  if (!user) throw new AppError('User not found', HttpStatus.NOT_FOUND);
  await user.destroy();
}
