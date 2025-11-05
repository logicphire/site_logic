import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(email: string, password: string) {
    console.log('🔐 Tentativa de login:', email);
    
    // Buscar usuário por email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    console.log('👤 Usuário encontrado:', user ? 'Sim' : 'Não');

    if (!user) {
      console.log('❌ Usuário não encontrado');
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    console.log('🔑 Senha no banco:', user.password);
    console.log('🔑 Senha fornecida:', password);

    // Verificar senha (em produção usar bcrypt para comparar hash)
    if (user.password !== password) {
      console.log('❌ Senha incorreta');
      throw new UnauthorizedException('Email ou senha incorretos');
    }
    
    console.log('✅ Login bem-sucedido');
    
    // Gerar um token simples (em produção use JWT)
    const token = crypto.randomBytes(32).toString('hex');
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        role: user.role,
      },
    };
  }

  async validateToken(token: string) {
    // Por enquanto, aceita qualquer token
    // Em produção, validar o JWT
    return { valid: true };
  }
}
