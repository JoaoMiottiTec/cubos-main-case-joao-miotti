import type { FastifyInstance } from 'fastify';

import { moviesController } from './controller.js';

export async function registerMovieRoutes(app: FastifyInstance) {
  app.post('/', moviesController.create);
  app.get('/', moviesController.list);

  app.get('/:id', moviesController.findById);
  app.delete('/:id', moviesController.remove);
}
