import type { FastifyReply, FastifyRequest } from 'fastify';
import { asyncHandler } from '../../core/asyncHandler.js';
import { loginSchema } from '../users/validation.js'; 
import { authService } from './service.js';

export const authController = {
  login: asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(422).send({
        status: 'error',
        message: 'Validation failed',
        details: parsed.error.issues.map(i => ({ path: i.path, message: i.message })),
      });
    }

    const user = await authService.verifyCredentials(parsed.data);
    const token = await reply.jwtSign({ sub: user.id, email: user.email });
    return reply.status(200).send({ data: { user, token } });
  }),
};
