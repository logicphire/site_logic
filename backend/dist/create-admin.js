"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
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
//# sourceMappingURL=create-admin.js.map