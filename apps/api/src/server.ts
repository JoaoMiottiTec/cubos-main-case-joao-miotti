import 'dotenv/config';
import Fastify from 'fastify';

const app = Fastify({ logger: true });

app.get('/health', async () => ({ ok: true }));

const PORT = Number(process.env.PORT ?? 3333);
app
  .listen({ port: PORT, host: '0.0.0.0' })
  .then(() => app.log.info(`HTTP server running on http://localhost:${PORT}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
