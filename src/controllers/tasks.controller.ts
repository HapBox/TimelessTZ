import { Op } from 'sequelize';
import { Folder } from 'src/database/models/final/folder.model';
import { Task } from 'src/database/models/final/task.model';
import { User } from 'src/database/models/final/user.model';
import { requireToken } from 'src/middlewares/require-token';
import { AccessTypeEnum } from 'src/utils/constants';
import { throwErrorSimple, throwNotFoundError } from 'src/utils/utils-errors';

export default async function taskRoutes(fastify, options) {
  const createUpdateBodyJsonSchema = {
    type: 'object',
    required: ['name', 'folderId', 'description'],
    properties: {
      name: { type: 'string' },
    },
  };

  const createUpdateSchema = {
    body: createUpdateBodyJsonSchema,
  };

  fastify.post('/tasks', { schema: createUpdateSchema, preHandler: [requireToken] }, async (request, reply) => {
    const folder = await Folder.findOne({
      where: {
        id: request.body.folderId,
      },
      include: [
        {
          model: User,
          required: true,
          through: {
            where: {
              userLogin: request.userLogin,
              [Op.or]: [{ access: AccessTypeEnum.CREATOR }, { access: AccessTypeEnum.CREATE }],
            },
          },
        },
      ],
    });
    if (!folder) throwErrorSimple('Forbidden', 403);

    const task = await Task.create({
      folderId: request.body.folderId,
      name: request.body.name,
      description: request.body.description,
    });

    return { task };
  });

  fastify.get('/tasks/:id', { preHandler: [requireToken] }, async (request, reply) => {
    const task = await Task.findOne({
      where: {
        id: request.params.id,
      },
      include: [
        {
          model: Folder,
          required: true,
          include: [
            {
              model: User,
              required: true,
              through: {
                where: {
                  userLogin: request.userLogin,
                  [Op.or]: [{ access: AccessTypeEnum.CREATOR }, { access: AccessTypeEnum.READ }],
                },
              },
            },
          ],
        },
      ],
    });
    if (!task) throwNotFoundError('Task not found');

    return { task };
  });

  fastify.patch('/tasks/:id', { schema: createUpdateSchema, preHandler: [requireToken] }, async (request, reply) => {
    const folder = await Folder.findOne({
      where: {
        id: request.body.folderId,
      },
      include: [
        {
          model: User,
          required: true,
          through: {
            where: {
              userLogin: request.userLogin,
              [Op.or]: [{ access: AccessTypeEnum.CREATOR }, { access: AccessTypeEnum.UPDATE }],
            },
          },
        },
      ],
    });
    if (!folder) throwErrorSimple('Forbidden', 403);

    const task = await Task.update(
      {
        folderId: request.body.folderId,
        name: request.body.name,
        description: request.body.description,
      },
      {
        where: {
          id: request.params.id,
        },
      },
    );

    return { task };
  });

  fastify.delete('/tasks/:id', { preHandler: [requireToken] }, async (request, reply) => {
    const task = await Task.findOne({
      where: {
        id: request.params.id,
      },
      include: [
        {
          model: Folder,
          required: true,
          include: [
            {
              model: User,
              required: true,
              through: {
                where: {
                  userLogin: request.userLogin,
                  [Op.or]: [{ access: AccessTypeEnum.CREATOR }, { access: AccessTypeEnum.DELETE }],
                },
              },
            },
          ],
        },
      ],
    });
    if (!task) throwNotFoundError('Task not found');

    await task.destroy();

    return { message: 'Succesfull!' };
  });
}
