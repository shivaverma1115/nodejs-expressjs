import { asyncHandler } from '../../common/utils/asyncHandler';
import { sendPaginated, sendSuccess } from '../../common/utils/apiResponse';
import { HttpStatus } from '../../common/constants/httpStatus';
import * as userService from './user.service';

export const me = asyncHandler(async (req, res) => {
  const user = await userService.getMe(req.user!.id);
  sendSuccess(res, user, 'Profile fetched');
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateMe(req.user!.id, req.body);
  sendSuccess(res, user, 'Profile updated');
});

export const list = asyncHandler(async (req, res) => {
  const result = await userService.listUsers(req.query);
  sendPaginated(res, result.data, result.meta, 'Users fetched');
});

export const adminUpdate = asyncHandler(async (req, res) => {
  const user = await userService.adminUpdateUser(Number(req.params.id), req.body);
  sendSuccess(res, user, 'User updated');
});

export const adminDelete = asyncHandler(async (req, res) => {
  await userService.adminDeleteUser(Number(req.params.id));
  res.status(HttpStatus.NO_CONTENT).send();
});
