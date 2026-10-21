import { asyncHandler } from '../../common/utils/asyncHandler';
import { sendSuccess } from '../../common/utils/apiResponse';
import { HttpStatus } from '../../common/constants/httpStatus';
import { AppError } from '../../common/errors/AppError';
import { getStorageProvider } from '../../storage';
import { enqueueImage } from '../../jobs/queues';
import { env } from '../../config/env';

export const upload = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('file is required', HttpStatus.BAD_REQUEST);
  }
  const stored = await getStorageProvider().upload(req.file);
  await enqueueImage({ url: stored.url, originalName: stored.originalName });
  sendSuccess(
    res,
    { ...stored, storageProvider: env.STORAGE_PROVIDER },
    'File uploaded successfully',
    HttpStatus.CREATED,
  );
});
