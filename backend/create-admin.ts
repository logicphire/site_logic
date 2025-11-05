import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criar usuário admin de teste
  const user = await prisma.user.upsert({
    where: { email: 'admin@logicphire.com' },
    update: {},
    create: {
      email: 'admin@logicphire.com',
      nome: 'Administrador',
      password: 'admin123',
      firebaseUid: 'temp_admin_' + Date.now(),
      role: 'admin',
    },
  });

  console.log('✅ Usuário criado/atualizado:');
  console.log('📧 Email:', user.email);
  console.log('🔑 Senha: admin123');
  console.log('👤 Nome:', user.nome);
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
