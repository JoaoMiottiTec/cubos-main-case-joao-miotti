import { FastifyInstance } from 'fastify';
import { StorageController } from './controller.js';

export async function registerStorageRoutes(app: FastifyInstance) {
  const ctrl = new StorageController();

  app.post('/presign-upload', async (req, reply) => {
    const { status, body } = await ctrl.presignUpload(req.body);
    return reply.code(status).send(body);
  });

  app.post('/presign-download', async (req, reply) => {
    const { status, body } = await ctrl.presignDownload(req.body);
    return reply.code(status).send(body);
  });

  app.post('/movies/:movieId/images/confirm', async (req, reply) => {
    const { status, body } = await ctrl.confirmUpload(req.params, req.body);
    return reply.code(status).send(body);
  });
}
