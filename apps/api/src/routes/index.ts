import { FastifyInstance } from 'fastify';

import { registerAuthRoutes } from '../modules/auth/routes.js';
import { registerMovieRoutes } from '../modules/movies/routes.js';
import { registerUserRoutes } from '../modules/users/routes.js';

export function registerRoutes(app: FastifyInstance) {
  app.register(registerUserRoutes, { prefix: '/users' });
  app.register(registerAuthRoutes, { prefix: '/auth' });
  app.register(registerMovieRoutes, { prefix: '/movies' });
}
