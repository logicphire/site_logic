import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function migratePasswords() {
  console.log('🔄 Iniciando migração de senhas...');

  try {
    // Buscar todos os usuários
    const users = await prisma.user.findMany();

    console.log(`📊 Encontrados ${users.length} usuários`);

    for (const user of users) {
      // Verificar se a senha já está criptografada (bcrypt hash tem 60 caracteres e começa com $2)
      if (user.password.startsWith('$2') && user.password.length === 60) {
        console.log(`✅ Senha do usuário ${user.email} já está criptografada`);
        continue;
      }

      // Criptografar a senha
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Atualizar no banco
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      console.log(`🔐 Senha do usuário ${user.email} foi criptografada`);
    }

    console.log('✅ Migração concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro na migração:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migratePasswords();
