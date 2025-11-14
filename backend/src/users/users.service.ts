import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as admin from 'firebase-admin';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // Criptografar a senha antes de salvar
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      
      // Salvar no banco de dados
      const user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          nome: createUserDto.nome,
          password: hashedPassword,
          role: createUserDto.role || 'user',
        },
      });

      return {
        id: user.id,
        email: user.email,
        nome: user.nome,
        role: user.role,
        createdAt: user.createdAt,
      };
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email já cadastrado');
      }
      throw error;
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      where: { ativo: true },
      orderBy: { createdAt: 'desc' },
    });

    return users.map(user => ({
      id: user.id,
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

    // Se a senha foi fornecida, criptografá-la
    const dataToUpdate: any = { ...updateUserDto };
    if (updateUserDto.password) {
      dataToUpdate.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Atualizar no banco
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    return {
      id: updatedUser.id,
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

    // Marcar como inativo ao invés de deletar
    await this.prisma.user.update({
      where: { id },
      data: { ativo: false },
    });

    return { message: 'Usuário desativado com sucesso' };
  }
}
