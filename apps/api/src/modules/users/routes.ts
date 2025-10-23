
import type { FastifyInstance } from 'fastify';
import { usersController } from './controller.js';

const auth = async (req: any, reply: any) => {
  try {
    await req.jwtVerify();
  } catch {
    return reply.status(401).send({ status: 'error', message: 'Unauthorized' });
  }
};

export async function registerUserRoutes(app: FastifyInstance) {

  app.post('/', usersController.create);

  app.get('/', { preHandler: auth }, usersController.list);
  app.get('/:id', { preHandler: auth }, usersController.findById);
  app.patch('/:id', { preHandler: auth }, usersController.update);
  app.delete('/:id', { preHandler: auth }, usersController.remove);
}
