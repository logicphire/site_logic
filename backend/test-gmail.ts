/**
 * Script de teste para verificar configuração do Gmail API
 * 
 * Como usar:
 * 1. Configure o arquivo .env com as credenciais do Google Cloud
 * 2. Execute: npx ts-node test-gmail.ts
 */

import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

async function testarEmailGmail() {
  console.log('🚀 Iniciando teste de envio de email com Gmail API...\n');

  // Verificar se as variáveis de ambiente estão configuradas
  const requiredEnvs = [
    'GMAIL_CLIENT_ID',
    'GMAIL_CLIENT_SECRET',
    'GMAIL_REFRESH_TOKEN',
    'GMAIL_USER',
  ];

  const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
  
  if (missingEnvs.length > 0) {
    console.error('❌ Variáveis de ambiente faltando:');
    missingEnvs.forEach(env => console.error(`   - ${env}`));
    console.error('\n⚠️  Configure essas variáveis no arquivo .env');
    console.error('📖 Veja o guia em: EMAIL_SETUP.md ou GOOGLE_CLOUD_SETUP.md\n');
    process.exit(1);
  }

  console.log('✅ Todas as variáveis de ambiente estão configuradas\n');

  // Criar transporter com OAuth2
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_USER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
  });

  console.log('📧 Configuração do transporter:');
  console.log(`   De: ${process.env.GMAIL_USER}`);
  console.log(`   Para: ${process.env.GMAIL_USER} (email de teste)\n`);

  // Email de teste
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER, // Envia para si mesmo
    subject: '✅ Teste de Configuração Gmail API - Site Logic',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; color: white; text-align: center;">
          <h1 style="margin: 0;">🎉 Configuração Bem-Sucedida!</h1>
        </div>
        
        <div style="background: #f7fafc; padding: 30px; border-radius: 10px; margin-top: 20px;">
          <h2 style="color: #2d3748;">Parabéns! 🚀</h2>
          <p style="color: #4a5568; line-height: 1.6;">
            Sua aplicação NestJS está configurada corretamente para enviar emails usando a Gmail API com OAuth2.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #667eea; margin-top: 0;">✅ Checklist de Configuração</h3>
            <ul style="color: #4a5568;">
              <li>✅ Google Cloud Platform configurado</li>
              <li>✅ Gmail API ativada</li>
              <li>✅ Credenciais OAuth2 criadas</li>
              <li>✅ Refresh Token gerado</li>
              <li>✅ Variáveis de ambiente configuradas</li>
              <li>✅ Nodemailer funcionando</li>
            </ul>
          </div>

          <div style="background: #e6fffa; padding: 15px; border-radius: 8px; border-left: 4px solid #38b2ac;">
            <p style="margin: 0; color: #234e52;">
              <strong>📊 Informações:</strong><br>
              Conta: ${process.env.GMAIL_USER}<br>
              Data: ${new Date().toLocaleString('pt-BR')}<br>
              Ambiente: ${process.env.NODE_ENV || 'development'}
            </p>
          </div>

          <p style="color: #718096; font-size: 14px; margin-top: 20px;">
            Agora você pode enviar emails de orçamento, notificações e confirmações para seus clientes!
          </p>
        </div>

        <div style="text-align: center; margin-top: 20px; color: #a0aec0; font-size: 12px;">
          <p>Site Logic - Sistema de Envio de Emails</p>
        </div>
      </div>
    `,
  };

  try {
    console.log('📤 Enviando email de teste...\n');
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email enviado com sucesso!\n');
    console.log('📋 Detalhes:');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}\n`);
    console.log('🎉 Configuração validada! Verifique sua caixa de entrada.\n');
    
  } catch (error) {
    console.error('❌ Erro ao enviar email:\n');
    console.error(error);
    console.error('\n💡 Dicas para resolver:');
    console.error('   1. Verifique se o Refresh Token está correto');
    console.error('   2. Confirme que a Gmail API está ativada no GCP');
    console.error('   3. Verifique se o email em GMAIL_USER está correto');
    console.error('   4. Tente gerar um novo Refresh Token no OAuth Playground');
    console.error('\n📖 Consulte: EMAIL_SETUP.md ou GOOGLE_CLOUD_SETUP.md\n');
    process.exit(1);
  }
}

// Executar teste
testarEmailGmail();
