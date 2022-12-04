import { Token } from 'src/database/models/final/token.model';
import { User } from 'src/database/models/final/user.model';
import { throwErrorSimple } from 'src/utils/utils-errors';
import { nanoid } from 'nanoid';

export default async function authRoutes(fastify, options) {
  const authBodyJsonSchema = {
    type: 'object',
    required: ['login', 'password'],
    properties: {
      login: { type: 'string' },
      password: { type: 'string' },
    },
  };

  const schema = {
    body: authBodyJsonSchema,
  };

  fastify.post('/auth/registration', { schema }, async (request, reply) => {
    const checkUser = await User.findByPk(request.body.login);
    if (checkUser) throwErrorSimple('User with this login exist', 400);

    const user = await User.create({
      login: request.body.login,
      password: request.body.password,
    });

    const token = await Token.create({
      userLogin: user.login,
      token: nanoid(128),
    });

    return { token: token.token };
  });

  fastify.post('/auth/login', { schema }, async (request, reply) => {
    const user = await User.findOne({
      where: {
        login: request.body.login,
        password: request.body.password,
      },
    });

    if (!user) throwErrorSimple('Wrong login or password', 401);

    const token = await Token.create({
      userLogin: user.login,
      token: nanoid(128),
    });

    return { token: token.token };
  });
}
