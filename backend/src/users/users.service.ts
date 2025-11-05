import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      let firebaseUid: string;

      try {
        // Tentar criar usuário no Firebase
        const firebaseUser = await admin.auth().createUser({
          email: createUserDto.email,
          password: createUserDto.password,
          displayName: createUserDto.nome,
        });
        firebaseUid = firebaseUser.uid;
      } catch (firebaseError: any) {
        // Se Firebase não estiver configurado, gerar um UID temporário
        console.warn('Firebase não configurado, gerando UID temporário');
        firebaseUid = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }

      // Salvar no banco de dados
      const user = await this.prisma.user.create({
        data: {
          firebaseUid,
          email: createUserDto.email,
          nome: createUserDto.nome,
          password: createUserDto.password, // Salvar senha (em produção usar hash)
          role: createUserDto.role || 'admin',
        },
      });

      return {
        id: user.id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        nome: user.nome,
        role: user.role,
        createdAt: user.createdAt,
      };
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists' || error.code === 'P2002') {
        throw new ConflictException('Email já cadastrado');
      }
      throw error;
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map(user => ({
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      nome: user.nome,
      role: user.role,
      createdAt: user.createdAt,
    }));
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      nome: user.nome,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Atualizar no Firebase se necessário
    const firebaseUpdate: any = {};
    if (updateUserDto.email) firebaseUpdate.email = updateUserDto.email;
    if (updateUserDto.nome) firebaseUpdate.displayName = updateUserDto.nome;

    if (Object.keys(firebaseUpdate).length > 0) {
      await admin.auth().updateUser(user.firebaseUid, firebaseUpdate);
    }

    // Atualizar no banco
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return {
      id: updatedUser.id,
      firebaseUid: updatedUser.firebaseUid,
      email: updatedUser.email,
      nome: updatedUser.nome,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
    };
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Tentar deletar do Firebase (se não for UID temporário)
    if (!user.firebaseUid.startsWith('temp_')) {
      try {
        await admin.auth().deleteUser(user.firebaseUid);
      } catch (firebaseError: any) {
        console.warn('Erro ao deletar usuário do Firebase:', firebaseError.message);
        // Continua mesmo se falhar no Firebase
      }
    }

    // Deletar do banco
    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'Usuário deletado com sucesso' };
  }
}
