import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Populando banco de dados...');

  // Limpar dados antigos
  await prisma.contato.deleteMany();
  await prisma.orcamento.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuário admin padrão
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@sitelogic.com',
      nome: 'Administrador',
      password: 'admin@2025', // IMPORTANTE: Trocar esta senha após primeiro login!
      role: 'super_admin',
      ativo: true,
    },
  });
  console.log(`✅ Usuário admin criado: ${adminUser.email}`);

  // Criar projetos
  const projects = await prisma.project.createMany({
    data: [
      {
        titulo: 'App Delivery Premium',
        descricao: 'Aplicativo completo de delivery com sistema de pedidos em tempo real, pagamento integrado, rastreamento de entrega e chat com estabelecimento.',
        categoria: 'Mobile',
        tipo: 'Aplicativo',
        plataforma: 'iOS/Android',
        imagem: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1600&q=80',
        tecnologias: ['React Native', 'Firebase', 'Stripe', 'Google Maps API'],
        link: 'https://play.google.com',
        tipoLink: 'playstore',
        destaque: true,
        ordem: 1,
      },
      {
        titulo: 'E-commerce Fashion Store',
        descricao: 'Loja virtual completa para moda feminina com sistema de pagamento, carrinho e painel administrativo.',
        categoria: 'Website',
        tipo: 'Site',
        plataforma: 'Web',
        imagem: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        tecnologias: ['Next.js', 'Stripe', 'Tailwind CSS', 'MongoDB'],
        link: 'https://example.com',
        tipoLink: 'site',
        destaque: false,
        ordem: 2,
      },
      {
        titulo: 'App Fitness Tracker',
        descricao: 'Aplicativo de acompanhamento fitness com treinos personalizados e tracking de progresso.',
        categoria: 'Mobile',
        tipo: 'Aplicativo',
        plataforma: 'iOS/Android',
        imagem: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
        tecnologias: ['Flutter', 'Firebase', 'HealthKit', 'Google Fit'],
        link: 'https://apps.apple.com',
        tipoLink: 'appstore',
        destaque: false,
        ordem: 3,
      },
      {
        titulo: 'Portal Institucional Médico',
        descricao: 'Website institucional para clínica médica com agendamento online e telemedicina.',
        categoria: 'Website',
        tipo: 'Site',
        plataforma: 'Web',
        imagem: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
        tecnologias: ['React', 'Node.js', 'PostgreSQL', 'WebRTC'],
        link: 'https://example.com',
        tipoLink: 'site',
        destaque: false,
        ordem: 4,
      },
      {
        titulo: 'App Gestão Financeira',
        descricao: 'Controle financeiro pessoal com gráficos interativos e sincronização multi-dispositivo.',
        categoria: 'Mobile',
        tipo: 'Aplicativo',
        plataforma: 'iOS/Android',
        imagem: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
        tecnologias: ['React Native', 'MongoDB', 'Chart.js'],
        link: 'https://play.google.com',
        tipoLink: 'playstore',
        destaque: false,
        ordem: 5,
      },
      {
        titulo: 'Landing Page Imobiliária',
        descricao: 'Site moderno para corretora com busca avançada de imóveis e tour virtual 360°.',
        categoria: 'Website',
        tipo: 'Site',
        plataforma: 'Web',
        imagem: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
        tecnologias: ['Vue.js', 'Three.js', 'AWS', 'Mapbox'],
        link: 'https://example.com',
        tipoLink: 'site',
        destaque: false,
        ordem: 6,
      },
    ],
  });
  console.log(`✅ ${projects.count} projetos criados`);

  // Criar orçamentos
  const orcamentos = await prisma.orcamento.createMany({
    data: [
      {
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '(85) 99999-9999',
        empresa: 'Empresa X',
        tipoServico: 'Desenvolvimento de Sites',
        prazo: '1-2 meses',
        orcamento: 'R$ 5.000 - R$ 10.000',
        descricaoProjeto: 'Preciso de um site institucional moderno para minha empresa',
        status: 'pendente',
      },
      {
        nome: 'Maria Santos',
        email: 'maria@example.com',
        telefone: '(85) 98888-8888',
        empresa: 'Startup Y',
        tipoServico: 'Aplicativos Mobile',
        prazo: '3-6 meses',
        orcamento: 'R$ 20.000 - R$ 50.000',
        descricaoProjeto: 'Desenvolvimento de app de delivery',
        status: 'em_analise',
      },
    ],
  });
  console.log(`✅ ${orcamentos.count} orçamentos criados`);

  // Criar contatos
  const contatos = await prisma.contato.createMany({
    data: [
      {
        nome: 'Pedro Costa',
        email: 'pedro@example.com',
        telefone: '(85) 97777-7777',
        mensagem: 'Gostaria de saber mais sobre os serviços de desenvolvimento web.',
        status: 'novo',
      },
      {
        nome: 'Ana Paula',
        email: 'ana@example.com',
        telefone: '(85) 96666-6666',
        mensagem: 'Tenho interesse em desenvolver um aplicativo mobile.',
        status: 'lido',
      },
    ],
  });
  console.log(`✅ ${contatos.count} contatos criados`);

  console.log('🎉 Banco populado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
