import { Request, Response, NextFunction } from 'express';

import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';  
import { AppError } from '../utils/helper/AppError';




export const errorHandler = ( err: Error | AppError, req: Request, res: Response, _next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params
  });

  
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    error = new AppError(formattedErrors || 'Validation failed', 400);
  }

 
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        error = new AppError('Duplicate field value entered', 400);
        break;
      case 'P2025':
        error = new AppError('Record not found', 404);
        break;
      case 'P2003':
        error = new AppError('Foreign key constraint failed', 400);
        break;
      default:
        error = new AppError('Database error occurred', 500);
        break;
    }
  }


  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    error = new AppError('Database connection error', 503);
  }

 
  if (err instanceof Prisma.PrismaClientValidationError) {
    error = new AppError('Invalid data provided', 400);
  }


  if ((err as any).code === 11000) {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }


  if (err.name === 'ValidationError') {
    const message = Object.values((err as any).errors)
      .map((val: any) => val.message)
      .join(', ');
    error = new AppError(message, 400);
  }

 
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired', 401);
  }

  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  const statusCode = (error as AppError).statusCode || 500;
  const message = error.message || 'Internal Server Error';

  const errorResponse: any = {
    success: false,
    message
  };

  


  res.status(statusCode).json(errorResponse);
};