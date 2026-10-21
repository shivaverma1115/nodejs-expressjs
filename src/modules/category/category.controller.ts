import { asyncHandler } from '../../common/utils/asyncHandler';
import { sendPaginated, sendSuccess } from '../../common/utils/apiResponse';
import { HttpStatus } from '../../common/constants/httpStatus';
import * as categoryService from './category.service';

export const create = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body.name);
  sendSuccess(res, category, 'Category created', HttpStatus.CREATED);
});

export const list = asyncHandler(async (req, res) => {
  const result = await categoryService.listCategories(req.query);
  sendPaginated(res, result.data, result.meta, 'Categories fetched');
});

export const show = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategory(Number(req.params.id));
  sendSuccess(res, category, 'Category fetched');
});

export const replace = asyncHandler(async (req, res) => {
  const category = await categoryService.replaceCategory(Number(req.params.id), req.body.name);
  sendSuccess(res, category, 'Category replaced');
});

export const patch = asyncHandler(async (req, res) => {
  const category = await categoryService.patchCategory(Number(req.params.id), req.body);
  sendSuccess(res, category, 'Category updated');
});

export const remove = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(Number(req.params.id));
  res.status(HttpStatus.NO_CONTENT).send();
});
