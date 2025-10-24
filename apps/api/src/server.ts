import 'dotenv/config';

import fastifyJwt from '@fastify/jwt';
import Fastify from 'fastify';

import { registerRoutes } from './routes/index.js';

const app = Fastify({ logger: true });

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
});

app.get('/health', async () => ({ ok: true }));

registerRoutes(app);

const PORT = Number(process.env.PORT ?? 3333);
app
  .listen({ port: PORT, host: '0.0.0.0' })
  .then(() => app.log.info(`HTTP server running on http://localhost:${PORT}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });

export default app;
