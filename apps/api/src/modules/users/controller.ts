import type { FastifyReply, FastifyRequest } from 'fastify';
import { asyncHandler } from '../../core/asyncHandler.js';
import { usersService } from './service.js';
import { createUserSchema, IdParam, ListQuery, updateUserSchema } from './validation.js';


export const usersController = {
  create: asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(422).send({
        status: 'error',
        message: 'Validation failed',
        details: parsed.error.issues.map(i => ({ path: i.path, message: i.message })),
      });
    }

    const user = await usersService.create(parsed.data);
    return reply.status(201).send({ data: user });
  }),

  findById: asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = IdParam.safeParse(req.params);
    if (!parsed.success) {
      return reply.status(422).send({
        status: 'error',
        message: 'Validation failed',
        details: parsed.error.issues.map(i => ({ path: i.path, message: i.message })),
      });
    }

    const user = await usersService.findById(parsed.data.id);
    return reply.status(200).send({ data: user });
  }),

  list: asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = ListQuery.safeParse(req.query);
    if (!parsed.success) {
      return reply.status(422).send({
        status: 'error',
        message: 'Validation failed',
        details: parsed.error.issues.map(i => ({ path: i.path, message: i.message })),
      });
    }

    const result = await usersService.list(parsed.data.page, parsed.data.pageSize);
    return reply.status(200).send({ data: result });
  }),

  update: asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
    const params = IdParam.safeParse(req.params);
    const body = updateUserSchema.safeParse(req.body);

    if (!params.success || !body.success) {
      const issues = [
        ...(params.success ? [] : params.error.issues),
        ...(body.success ? [] : body.error.issues),
      ];
      return reply.status(422).send({
        status: 'error',
        message: 'Validation failed',
        details: issues.map(i => ({ path: i.path, message: i.message })),
      });
    }

    const user = await usersService.update(params.data.id, body.data);
    return reply.status(200).send({ data: user });
  }),

  remove: asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = IdParam.safeParse(req.params);
    if (!parsed.success) {
      return reply.status(422).send({
        status: 'error',
        message: 'Validation failed',
        details: parsed.error.issues.map(i => ({ path: i.path, message: i.message })),
      });
    }

    const result = await usersService.remove(parsed.data.id);
    return reply.status(200).send({ data: result });
  }),
};
