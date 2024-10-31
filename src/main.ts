import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import * as MongoDBStore from 'connect-mongodb-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix(config.get('HTTP_PREFIX'));

  const configSwagger = new DocumentBuilder()
    .setTitle(`${config.get('SERVICE_NAME')} microservice`)
    .setDescription('API Documentation')
    .addServer(
      `http://${config.get('HTTP_HOST')}:${config.get('HTTP_PORT')}${config.get('HTTP_PREFIX')}`,
    )
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);

  SwaggerModule.setup(`${config.get('HTTP_PREFIX')}/docs`, app, document);

  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());

  const MongoDBStoreSession = MongoDBStore(session);

  const store = new MongoDBStoreSession({
    uri: 'mongodb://admin:flooder22@localhost:27017/hotel?authSource=admin', // Замените на ваш URL подключения к MongoDB
    collection: 'sessions',
  });

  store.on('error', function (error) {
    console.log('Ошибка подключения к хранилищу сессий MongoDB:', error);
  });

  app.use(
    session({
      secret: 'your-secret-key', // Замените на ваш секретный ключ
      resave: false,
      saveUninitialized: false,
      store: store,
      cookie: {
        maxAge: 3600000, // Время жизни куки в миллисекундах
        httpOnly: true,
        secure: false, // Установите true, если используете HTTPS
        sameSite: 'lax', // Настройте в соответствии с вашими потребностями
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(config.get('HTTP_PORT'));
}
bootstrap();
