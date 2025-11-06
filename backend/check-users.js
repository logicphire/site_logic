const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany();
    console.log('\n📊 Total de usuários no banco:', users.length);
    console.log('\n👥 Usuários cadastrados:\n');
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.nome}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Ativo: ${user.ativo ? 'Sim' : 'Não'}`);
      console.log(`   Criado em: ${new Date(user.createdAt).toLocaleString('pt-BR')}`);
      console.log('');
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
