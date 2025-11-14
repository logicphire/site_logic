import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    // Configuração do transporter usando OAuth2 para Gmail API
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      },
    });
  }

  async enviarEmailNovoOrcamento(dados: {
    nome: string;
    email: string;
    telefone: string;
    empresa?: string;
    tipoServico: string;
    prazo: string;
    diasPersonalizados?: string;
    dataInicio?: string;
    orcamento: string;
    descricaoProjeto: string;
  }) {
    const prazoTexto = this.formatarPrazo(dados.prazo, dados.diasPersonalizados, dados.dataInicio);
    
    // Email para a empresa (notificação de novo orçamento)
    const emailEmpresa = {
      from: process.env.GMAIL_USER,
      to: process.env.EMAIL_ORCAMENTOS || process.env.GMAIL_USER,
      subject: `🆕 Novo Orçamento - ${dados.nome}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 8px;">
            <h1 style="color: #667eea; margin-bottom: 20px;">📋 Novo Orçamento Recebido!</h1>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #2d3748; font-size: 18px; margin-bottom: 15px;">👤 Dados do Cliente</h2>
              <p><strong>Nome:</strong> ${dados.nome}</p>
              <p><strong>Email:</strong> <a href="mailto:${dados.email}">${dados.email}</a></p>
              <p><strong>Telefone:</strong> <a href="tel:${dados.telefone}">${dados.telefone}</a></p>
              ${dados.empresa ? `<p><strong>Empresa:</strong> ${dados.empresa}</p>` : ''}
            </div>

            <div style="background: #edf2f7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #2d3748; font-size: 18px; margin-bottom: 15px;">💼 Detalhes do Projeto</h2>
              <p><strong>Tipo de Serviço:</strong> ${this.formatarTipoServico(dados.tipoServico)}</p>
              <p><strong>Orçamento:</strong> ${this.formatarOrcamento(dados.orcamento)}</p>
              <p><strong>Prazo:</strong> ${prazoTexto}</p>
            </div>

            <div style="background: #e6fffa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #2d3748; font-size: 18px; margin-bottom: 15px;">📝 Descrição do Projeto</h2>
              <p style="white-space: pre-wrap;">${dados.descricaoProjeto}</p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="http://localhost:5173/admin/orcamentos" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; 
                        font-weight: bold;">
                Ver no Painel Admin
              </a>
            </div>
          </div>
        </div>
      `,
    };

    // Email de confirmação para o cliente
    const emailCliente = {
      from: process.env.GMAIL_USER,
      to: dados.email,
      subject: '✅ Orçamento Recebido - Site Logic',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 8px;">
            <h1 style="color: #667eea; margin-bottom: 20px;">Olá, ${dados.nome}! 👋</h1>
            
            <p style="font-size: 16px; line-height: 1.6; color: #2d3748;">
              Recebemos sua solicitação de orçamento com sucesso! 🎉
            </p>

            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #2d3748; font-size: 18px; margin-bottom: 15px;">📋 Resumo da sua solicitação:</h2>
              <p><strong>Serviço:</strong> ${this.formatarTipoServico(dados.tipoServico)}</p>
              <p><strong>Prazo:</strong> ${prazoTexto}</p>
              <p><strong>Orçamento:</strong> ${this.formatarOrcamento(dados.orcamento)}</p>
            </div>

            <div style="background: #e6fffa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #38b2ac;">
              <h3 style="color: #2d3748; margin-bottom: 10px;">📞 Próximos Passos:</h3>
              <ul style="line-height: 1.8; color: #4a5568;">
                <li>Nossa equipe analisará seu projeto em até <strong>24 horas</strong></li>
                <li>Entraremos em contato via email ou WhatsApp</li>
                <li>Enviaremos uma proposta personalizada</li>
                <li>Agendaremos uma reunião para alinhar detalhes</li>
              </ul>
            </div>

            <p style="color: #718096; font-size: 14px; margin-top: 30px;">
              Caso tenha alguma dúvida, responda este email ou entre em contato pelo WhatsApp: 
              <a href="https://wa.me/55${dados.telefone.replace(/\D/g, '')}" style="color: #667eea;">
                ${dados.telefone}
              </a>
            </p>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #a0aec0; font-size: 12px;">
                Site Logic - Transformando ideias em realidade digital
              </p>
            </div>
          </div>
        </div>
      `,
    };

    try {
      // Enviar ambos os emails
      await Promise.all([
        this.transporter.sendMail(emailEmpresa),
        this.transporter.sendMail(emailCliente),
      ]);
      
      return { success: true, message: 'Emails enviados com sucesso' };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw new Error('Falha ao enviar email');
    }
  }

  private formatarTipoServico(tipo: string): string {
    const tipos: Record<string, string> = {
      'desenvolvimento-sites': 'Desenvolvimento de Sites',
      'desenvolvimento-app': 'Desenvolvimento de Aplicativos',
      'loja-virtual': 'Loja Virtual (E-commerce)',
      'design': 'Design e Identidade Visual',
      'consultoria': 'Consultoria em Tecnologia',
      'manutencao': 'Manutenção e Suporte',
      'outros': 'Outros',
    };
    return tipos[tipo] || tipo;
  }

  private formatarOrcamento(orcamento: string): string {
    const orcamentos: Record<string, string> = {
      'ate-5k': 'Até R$ 5.000',
      '5k-15k': 'R$ 5.000 - R$ 15.000',
      '15k-50k': 'R$ 15.000 - R$ 50.000',
      '50k-100k': 'R$ 50.000 - R$ 100.000',
      'acima-100k': 'Acima de R$ 100.000',
      'conversar': 'Prefiro conversar',
    };
    return orcamentos[orcamento] || orcamento;
  }

  private formatarPrazo(prazo: string, diasPersonalizados?: string, dataInicio?: string): string {
    const prazos: Record<string, string> = {
      'urgente': 'Urgente (até 2 semanas)',
      '1-mes': '1 mês',
      '2-3-meses': '2-3 meses',
      '3-6-meses': '3-6 meses',
      'flexivel': 'Flexível',
    };

    if (prazo === 'personalizado') {
      let texto = 'Personalizado: ';
      if (diasPersonalizados) {
        texto += `${diasPersonalizados} dias`;
      }
      if (dataInicio) {
        if (diasPersonalizados) texto += ', ';
        texto += `início em ${new Date(dataInicio).toLocaleDateString('pt-BR')}`;
      }
      return texto;
    }

    return prazos[prazo] || prazo;
  }
}
