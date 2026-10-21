import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { sendSuccess } from '../../common/utils/apiResponse';
import { HttpStatus } from '../../common/constants/httpStatus';
import { AppError } from '../../common/errors/AppError';
import * as authService from './auth.service';

function readRefreshToken(req: Request) {
  return (req.body?.refreshToken as string | undefined) || (req.cookies?.refreshToken as string | undefined);
}

function setRefreshCookie(res: Response, token: string) {
  res.cookie('refreshToken', token, authService.cookieOptions);
}

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  setRefreshCookie(res, result.tokens.refreshToken);
  sendSuccess(res, result, 'Registered successfully', HttpStatus.CREATED);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  setRefreshCookie(res, result.tokens.refreshToken);
  sendSuccess(res, result, 'Logged in successfully');
});

export const refresh = asyncHandler(async (req, res) => {
  const token = readRefreshToken(req);
  if (!token) {
    throw new AppError('Refresh token is required', HttpStatus.BAD_REQUEST);
  }
  const result = await authService.refresh(token);
  setRefreshCookie(res, result.tokens.refreshToken);
  sendSuccess(res, result, 'Token refreshed');
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(readRefreshToken(req));
  res.clearCookie('refreshToken', { path: authService.cookieOptions.path });
  sendSuccess(res, null, 'Logged out');
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  sendSuccess(res, null, 'If that email exists, a reset token has been queued');
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password);
  sendSuccess(res, null, 'Password reset successfully');
});

export const google = asyncHandler(async (req, res) => {
  const result = await authService.googleLogin(req.body.idToken);
  setRefreshCookie(res, result.tokens.refreshToken);
  sendSuccess(res, result, 'Logged in with Google');
});
