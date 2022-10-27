import express from 'express';

declare global {
  namespace Express {
    interface Request {
      profile?: Record<string, any>;
    }
  }
}
