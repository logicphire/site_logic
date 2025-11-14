import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

// Inicializar Firebase Admin
try {
  const serviceAccountPath = path.join(__dirname, '../firebase-service-account.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin inicializado com sucesso');
  } else {
    console.warn('⚠️ Arquivo firebase-service-account.json não encontrado. Sistema funcionará sem Firebase Admin.');
  }
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase Admin:', error.message);
  console.warn('⚠️ Sistema funcionará sem Firebase Admin.');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS - Configuração mais permissiva
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', process.env.CORS_ORIGIN].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Validation Pipe Global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global Prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
  console.log(`✅ CORS habilitado para: http://localhost:5173`);
  console.log(`📡 API disponível em http://localhost:${port}/api`);
  console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();
