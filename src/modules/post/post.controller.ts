import { asyncHandler } from '../../common/utils/asyncHandler';
import { sendPaginated, sendSuccess } from '../../common/utils/apiResponse';
import { HttpStatus } from '../../common/constants/httpStatus';
import * as postService from './post.service';

export const create = asyncHandler(async (req, res) => {
  const post = await postService.createPost(req.user!.id, req.body);
  sendSuccess(res, post, 'Post created successfully', HttpStatus.CREATED);
});

export const list = asyncHandler(async (req, res) => {
  const result = await postService.listPosts(req.query);
  sendPaginated(res, result.data, result.meta, 'Posts fetched successfully');
});

export const show = asyncHandler(async (req, res) => {
  const post = await postService.getPost(Number(req.params.id));
  sendSuccess(res, post, 'Post fetched successfully');
});

export const replace = asyncHandler(async (req, res) => {
  const post = await postService.replacePost(Number(req.params.id), req.user!, req.body);
  sendSuccess(res, post, 'Post replaced successfully');
});

export const patch = asyncHandler(async (req, res) => {
  const post = await postService.patchPost(Number(req.params.id), req.user!, req.body);
  sendSuccess(res, post, 'Post updated successfully');
});

export const remove = asyncHandler(async (req, res) => {
  await postService.deletePost(Number(req.params.id), req.user!);
  res.status(HttpStatus.NO_CONTENT).send();
});
