import type { FastifyReply, FastifyRequest } from 'fastify';

import { AppError } from './errors.js';

type Handler = (req: FastifyRequest, reply: FastifyReply) => Promise<unknown>;

export function asyncHandler(fn: Handler): Handler {
  return async (req, reply) => {
    try {
      return await fn(req, reply);
    } catch (err) {
      if (err instanceof AppError) {
        return reply.status(err.status).send({
          status: 'error',
          message: err.message,
          details: err.details,
        });
      }
      req.log.error(err);
      throw err;
    }
  };
}
