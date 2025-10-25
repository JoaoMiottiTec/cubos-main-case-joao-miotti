import type { FastifyReply, FastifyRequest } from 'fastify';
import { asyncHandler } from '../../core/asyncHandler.js';
import { moviesService } from './service.js';
import { createMovieSchema, listMoviesQuerySchema } from './validation.js';

const getUserId = (req: FastifyRequest) => {
  const u: any = (req as any).user;
  return u?.sub ?? u?.id;
};

export const moviesController = {
  create: asyncHandler(async (req, reply) => {
    await req.jwtVerify();
    const parsed = createMovieSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(422).send({
        status: 'error',
        message: 'Validation failed',
        details: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })),
      });
    }
    const userId = getUserId(req);
    const movie = await moviesService.create(userId, parsed.data);
    return reply.status(201).send({ data: movie });
  }),

  list: asyncHandler(async (req, reply) => {
    await req.jwtVerify();

    const parsed = listMoviesQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return reply.status(422).send({
        status: 'error',
        message: 'Validation failed',
        details: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })),
      });
    }

    const result = await moviesService.listAll(parsed.data);
    return reply.status(200).send({ data: result });
  }),

  findById: asyncHandler(async (req, reply) => {
    await req.jwtVerify();
    const id = (req.params as any).id as string;
    const movie = await moviesService.findById(id);
    return reply.status(200).send({ data: movie });
  }),

  update: asyncHandler(async (req, reply) => {
    await req.jwtVerify();
    const id = (req.params as any).id as string;
    const userId = getUserId(req);
    const parsed = createMovieSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return reply.status(422).send({
        status: 'error',
        message: 'Validation failed',
        details: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })),
      });
    }
    const movie = await moviesService.update(userId, id, parsed.data);
    return reply.status(200).send({ data: movie });
  }),

  remove: asyncHandler(async (req, reply) => {
    await req.jwtVerify();
    const id = (req.params as any).id as string;
    const userId = getUserId(req);
    const out = await moviesService.remove(userId, id);
    return reply.status(200).send({ data: out });
  }),
};
