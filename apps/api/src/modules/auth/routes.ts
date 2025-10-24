import type { FastifyInstance } from 'fastify';

import { usersController } from '../users/controller.js';
import { authController } from './controller.js';

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post('/login', authController.login);
  app.post('/signup', usersController.create);
}
