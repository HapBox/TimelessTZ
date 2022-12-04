import { throwErrorSimple, throwNotFoundError } from 'src/utils/utils-errors';
import { requireToken } from 'src/middlewares/require-token';
import { Folder } from 'src/database/models/final/folder.model';
import { User } from 'src/database/models/final/user.model';
import { AccessTypeEnum } from 'src/utils/constants';
import { Op } from 'sequelize';
import { MMUserFolder } from 'src/database/models/relations/mm-user-folder.model';
import { FastifyInstance } from 'fastify';
import { Task } from 'src/database/models/final/task.model';

export default async function folderRoutes(fastify, options) {
  const createBodyJsonSchema = {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string' },
    },
  };

  const createSchema = {
    body: createBodyJsonSchema,
  };

  fastify.post('/folders', { schema: createSchema, preHandler: [requireToken] }, async (request, reply) => {
    const folder = await Folder.create({
      name: request.body.name,
    });

    await MMUserFolder.create({
      userLogin: request.userLogin,
      folderId: folder.id,
      access: AccessTypeEnum.CREATOR,
    });

    return { folder };
  });

  fastify.get('/folders', { preHandler: [requireToken] }, async (request, reply) => {
    const folderList = await Folder.findAll({
      include: [
        {
          model: User,
          required: true,
          attributes: [],
          through: {
            attributes: [],
            where: {
              userLogin: request.userLogin,
              [Op.or]: [{ access: AccessTypeEnum.READ }, { access: AccessTypeEnum.CREATOR }],
            },
          },
        },
      ],
    });

    return { folderList };
  });

  fastify.get('/folders/:id', { preHandler: [requireToken] }, async (request, reply) => {
    const folder = await Folder.findOne({
      where: {
        id: request.params.id,
      },
      include: [
        {
          model: User,
          required: true,
          attributes: [],
          through: {
            attributes: [],
            where: {
              userLogin: request.userLogin,
              [Op.or]: [{ access: AccessTypeEnum.READ }, { access: AccessTypeEnum.CREATOR }],
            },
          },
        },
        {
          model: Task,
        },
      ],
    });

    if (!folder) throwNotFoundError('Folder Not Found');

    return { folder };
  });

  fastify.delete('/folders/:id', { preHandler: [requireToken] }, async (request, reply) => {
    const folder = await Folder.findOne({
      where: {
        id: request.params.id,
      },
      include: [
        {
          model: User,
          required: true,
          attributes: [],
          through: {
            attributes: [],
            where: {
              userLogin: request.userLogin,
              access: AccessTypeEnum.CREATOR,
            },
          },
        },
        {
          model: Task,
        },
      ],
    });

    if (!folder) throwNotFoundError('Folder Not Found');

    await folder.destroy();

    return { message: 'Succesfull!' };
  });

  const patchBodyJsonSchema = {
    type: 'object',
    required: ['userLogin', 'access'],
    properties: {
      userLogin: { type: 'string' },
      access: { type: 'string', enum: ['CREATE', 'READ', 'UPDATE', 'DELETE'] },
    },
  };

  const patchSchema = {
    body: patchBodyJsonSchema,
  };

  fastify.patch('/folders/:id/give', { schema: patchSchema, preHandler: [requireToken] }, async (request, reply) => {
    const folder = await Folder.findOne({
      where: {
        id: request.params.id,
      },
      include: [
        {
          model: User,
          required: true,
          attributes: [],
          through: {
            attributes: [],
            where: {
              userLogin: request.userLogin,
              access: AccessTypeEnum.CREATOR,
            },
          },
        },
        {
          model: Task,
        },
      ],
    });

    if (!folder) throwNotFoundError('Folder Not Found');

    const user = await User.findByPk(request.body.userLogin);
    if (!user) throwNotFoundError('User Not Found');

    const mmUserFolder = await MMUserFolder.findOne({
      where: {
        userLogin: request.body.userLogin,
        folderId: request.params.id,
        access: request.body.access,
      },
    });
    if (mmUserFolder) throwErrorSimple('User already have access', 409);

    await MMUserFolder.create({
      userLogin: request.body.userLogin,
      folderId: request.params.id,
      access: request.body.access,
    });

    return { message: 'Succesfull!' };
  });

  fastify.patch(
    '/folders/:id/take-away',
    { schema: patchSchema, preHandler: [requireToken] },
    async (request, reply) => {
      const folder = await Folder.findOne({
        where: {
          id: request.params.id,
        },
        include: [
          {
            model: User,
            required: true,
            attributes: [],
            through: {
              attributes: [],
              where: {
                userLogin: request.userLogin,
                access: AccessTypeEnum.CREATOR,
              },
            },
          },
          {
            model: Task,
          },
        ],
      });

      if (!folder) throwNotFoundError('Folder Not Found');

      const user = await User.findByPk(request.body.userLogin);
      if (!user) throwNotFoundError('User Not Found');

      const mmUserFolder = await MMUserFolder.findOne({
        where: {
          userLogin: request.body.userLogin,
          folderId: request.params.id,
          access: request.body.access,
        },
      });
      if (!mmUserFolder) throwErrorSimple('User already dont have access', 409);

      await mmUserFolder.destroy();

      return { message: 'Succesfull!' };
    },
  );
}
