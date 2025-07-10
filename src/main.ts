import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Analytics Dashboard API')
    .setDescription('APIs for analytics dashboard assignment')
    .setVersion('1.0')
    .addTag('Analytics')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI at /api

  // Enable CORS for all origins
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allow standard HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Allow specific headers
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
