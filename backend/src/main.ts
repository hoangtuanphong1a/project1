import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MikroORM } from '@mikro-orm/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from '@config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { HttpExceptionFilter } from '@common/filters/exception.filter';
import { MikroOrmMiddleware } from '@mikro-orm/nestjs';

async function bootstrap() {
  console.log('🚀 Starting NestJS application...');

  const app = await NestFactory.create(AppModule);
  console.log('✅ NestJS app created successfully');

  const configService = app.get(ConfigService);

  const orm = app.get(MikroORM);
  console.log('🔄 Setting up MikroORM middleware...');
  app.use(new MikroOrmMiddleware(orm).use.bind(new MikroOrmMiddleware(orm)));

  console.log('🔄 Enabling CORS...');
  app.enableCors({
    origin: (origin, callback) => {
      console.log('🔍 CORS request from origin:', origin);

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        console.log('✅ Allowing request with no origin');
        return callback(null, true);
      }

      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'http://127.0.0.1:3002',
        'http://127.0.0.1:3003',
      ];

      if (allowedOrigins.includes(origin)) {
        console.log('✅ Allowing CORS request from:', origin);
        return callback(null, true);
      }

      console.log('❌ Blocking CORS request from:', origin);
      return callback(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  console.log('🔄 Setting up Swagger documentation...');
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  console.log('🔄 Setting up global pipes, interceptors, and filters...');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = configService.get<number>('APP_PORT', 3003);
  console.log(`🚀 Starting server on port ${port}...`);

  await app.listen(port);
  console.log(`✅ Server is running on http://localhost:${port}`);
  console.log(`📖 Swagger docs available at http://localhost:${port}/docs`);
}
bootstrap();
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { MikroORM } from '@mikro-orm/core';
// import { ConfigService } from '@nestjs/config';
// import { SwaggerModule } from '@nestjs/swagger';
// import { swaggerConfig } from '@config/swagger.config';
// import { ValidationPipe } from '@nestjs/common';
// import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
// import { HttpExceptionFilter } from '@common/filters/exception.filter';
// import { MikroOrmMiddleware } from '@mikro-orm/nestjs';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const configService = app.get(ConfigService);

//   const orm = app.get(MikroORM);
//   app.use(new MikroOrmMiddleware(orm).use.bind(new MikroOrmMiddleware(orm)));

//   app.enableCors({
//     origin: '*',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     allowedHeaders: '*',
//     credentials: true,
//   });

//   const document = SwaggerModule.createDocument(app, swaggerConfig);
//   SwaggerModule.setup('docs', app, document);

//   app.useGlobalPipes(new ValidationPipe({ transform: true }));
//   app.useGlobalInterceptors(new ResponseInterceptor());
//   app.useGlobalFilters(new HttpExceptionFilter());

//   const port = configService.get<number>('APP_PORT', 3003);
//   await app.listen(port);
// }
// bootstrap();
