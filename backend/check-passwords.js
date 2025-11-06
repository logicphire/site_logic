const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPasswords() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nome: true,
        password: true,
        ativo: true
      }
    });
    
    console.log('\n🔑 Senhas dos usuários:\n');
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   Senha armazenada: ${user.password}`);
      console.log(`   Ativo: ${user.ativo ? 'Sim' : 'Não'}`);
      console.log('');
    });
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPasswords();
