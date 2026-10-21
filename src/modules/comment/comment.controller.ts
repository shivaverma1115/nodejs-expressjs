import { asyncHandler } from '../../common/utils/asyncHandler';
import { sendPaginated, sendSuccess } from '../../common/utils/apiResponse';
import { HttpStatus } from '../../common/constants/httpStatus';
import * as commentService from './comment.service';

export const create = asyncHandler(async (req, res) => {
  const comment = await commentService.createComment(req.user!.id, req.body);
  sendSuccess(res, comment, 'Comment created', HttpStatus.CREATED);
});

export const list = asyncHandler(async (req, res) => {
  const result = await commentService.listComments(req.query);
  sendPaginated(res, result.data, result.meta, 'Comments fetched');
});

export const show = asyncHandler(async (req, res) => {
  const comment = await commentService.getComment(Number(req.params.id));
  sendSuccess(res, comment, 'Comment fetched');
});

export const replace = asyncHandler(async (req, res) => {
  const comment = await commentService.replaceComment(Number(req.params.id), req.user!, req.body);
  sendSuccess(res, comment, 'Comment replaced');
});

export const patch = asyncHandler(async (req, res) => {
  const comment = await commentService.patchComment(Number(req.params.id), req.user!, req.body);
  sendSuccess(res, comment, 'Comment updated');
});

export const remove = asyncHandler(async (req, res) => {
  await commentService.deleteComment(Number(req.params.id), req.user!);
  res.status(HttpStatus.NO_CONTENT).send();
});
