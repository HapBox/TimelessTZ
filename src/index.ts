import fastify from 'fastify';
import authRoutes from './controllers/auth.controller';
import folderRoutes from './controllers/folders.controller';
import taskRoutes from './controllers/tasks.controller';
import { createDbIfNotExist, initSequelize } from './database/client';

async function bootstrap() {
  await createDbIfNotExist();
  await initSequelize();

  const app = fastify({ logger: true });

  app.register(authRoutes);
  app.register(folderRoutes);
  app.register(taskRoutes);

  app.listen({ port: 3000 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}

bootstrap();
