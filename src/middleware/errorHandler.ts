import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  if (err.message === 'Invalid credentials') {
    return res.status(401).json({ message: err.message });
  }

  if (err.message === 'Email already in use') {
    return res.status(409).json({ message: err.message });
  }

  if (err.message === 'Invalid token') {
    return res.status(401).json({ message: err.message });
  }

  res.status(500).json({ message: 'Something went wrong' });
};

export default errorHandler;