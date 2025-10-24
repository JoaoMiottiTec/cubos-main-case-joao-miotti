import 'fastify';
import '@fastify/jwt';

declare module 'fastify' {
  interface FastifyRequest {
    user?: { id: string; email: string };
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string; email: string };
    user: { id: string; email: string };
  }
}

declare module 'fastify' {
  interface FastifyReply {
    jwtSign: (payload: { sub: string; email: string }) => Promise<string>;
  }
}
