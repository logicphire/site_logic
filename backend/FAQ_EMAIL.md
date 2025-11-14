# ❓ FAQ - Gmail API com NestJS

## Perguntas Frequentes

### 🔐 Segurança

#### **P: É seguro usar OAuth2? As credenciais ficam expostas?**
**R:** Sim, é muito seguro! As credenciais ficam apenas no arquivo `.env` no servidor. O Refresh Token permite acesso apenas ao envio de emails, não à leitura. Nunca faça commit do arquivo `.env` no git.

#### **P: O que acontece se alguém roubar meu Refresh Token?**
**R:** Você pode revogá-lo imediatamente no [Google Cloud Console](https://console.cloud.google.com/) → APIs e Serviços → Credenciais. Depois, basta gerar um novo token.

#### **P: O Refresh Token expira?**
**R:** Não! O Refresh Token não expira, a menos que você o revogue manualmente ou desative a aplicação no GCP.

---

### 📧 Envio de Emails

#### **P: Quantos emails posso enviar por dia?**
**R:** 
- **Gmail Pessoal**: 500 emails/dia
- **Google Workspace**: 2000 emails/dia
- Para volumes maiores, use SendGrid, AWS SES ou Mailgun

#### **P: Os emails vão para spam?**
**R:** Não, se você usar sua própria conta Gmail legítima. O Gmail reconhece que você está enviando de uma aplicação autorizada. Para produção, configure SPF/DKIM no seu domínio.

#### **P: Posso usar um email personalizado (ex: contato@meudominio.com)?**
**R:** Com Gmail pessoal, não. Você precisa do **Google Workspace** para usar domínio próprio. Alternativamente, use serviços como SendGrid que permitem email customizado.

#### **P: Como sei se o email foi entregue?**
**R:** O `transporter.sendMail()` retorna um objeto com `messageId` e `response`. Se não houver erro, o email foi enviado. Para rastreamento avançado, use webhooks do SendGrid.

---

### ⚙️ Configuração

#### **P: Preciso refazer a configuração toda vez?**
**R:** Não! Você configura **uma única vez**. Depois, basta manter o arquivo `.env` com as mesmas credenciais.

#### **P: Posso usar múltiplas contas Gmail?**
**R:** Sim, mas cada conta precisa de suas próprias credenciais OAuth2. Você pode criar múltiplos transporters no código.

#### **P: Funciona em produção/hospedagem?**
**R:** Sim! Basta adicionar as variáveis de ambiente no seu serviço de hospedagem (Heroku, Vercel, AWS, etc.). Nunca faça commit do `.env`.

#### **P: Preciso ter Google Workspace?**
**R:** Não! Gmail pessoal funciona perfeitamente. Google Workspace só é necessário para domínio próprio ou volumes maiores.

---

### 🐛 Problemas Comuns

#### **P: Erro "invalid_grant" - O que fazer?**
**R:** 
1. Verifique se o Refresh Token está correto (sem espaços)
2. Confirme que usou a mesma conta Gmail em todos os passos
3. Regenere o Refresh Token no OAuth Playground
4. Verifique se a aplicação OAuth não foi revogada no GCP

#### **P: Erro "insufficient permissions" - Como resolver?**
**R:**
1. Volte ao GCP → Tela de consentimento OAuth
2. Verifique se o escopo `https://mail.google.com/` está adicionado
3. Refaça a autorização no OAuth Playground

#### **P: Erro "Daily sending quota exceeded"**
**R:** Você atingiu o limite de 500 emails/dia. Espere 24 horas ou:
- Upgrade para Google Workspace (2000/dia)
- Use serviço alternativo (SendGrid, AWS SES)

#### **P: Emails não estão sendo enviados, sem erro**
**R:**
1. Verifique os logs do backend (`console.log` ou `console.error`)
2. Confirme que todas as variáveis do `.env` estão preenchidas
3. Execute `npm run test:email` para validar
4. Verifique se o backend está rodando

---

### 🔄 Desenvolvimento vs Produção

#### **P: Posso usar Mailtrap em desenvolvimento?**
**R:** Sim! Mailtrap é excelente para testes. Crie uma variável `NODE_ENV`:

```typescript
// email.service.ts
constructor() {
  if (process.env.NODE_ENV === 'development') {
    // Mailtrap para testes
    this.transporter = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });
  } else {
    // Gmail OAuth2 para produção
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { /* OAuth2 config */ },
    });
  }
}
```

#### **P: Como faço deploy sem expor as credenciais?**
**R:** Use variáveis de ambiente do seu provedor:
- **Vercel**: Settings → Environment Variables
- **Heroku**: Settings → Config Vars
- **AWS**: Secrets Manager ou Parameter Store
- **Docker**: arquivo `.env` ou secrets

---

### 💼 Custos

#### **P: Gmail API é grátis?**
**R:** Sim! Até 500 emails/dia é totalmente gratuito. Sem custos ocultos.

#### **P: Quanto custa escalar?**
**R:**
- **Google Workspace**: ~R$ 30/mês (2000 emails/dia)
- **SendGrid**: Grátis até 100/dia, depois $19.95/mês (40.000/mês)
- **AWS SES**: $0.10 por 1.000 emails (muito barato em volume)

---

### 📱 Recursos Avançados

#### **P: Posso enviar anexos?**
**R:** Sim! Adicione ao `mailOptions`:
```typescript
attachments: [
  {
    filename: 'documento.pdf',
    path: '/caminho/para/arquivo.pdf'
  }
]
```

#### **P: Como personalizar o remetente (nome exibido)?**
**R:**
```typescript
from: '"Site Logic" <seu-email@gmail.com>'
// ou
from: {
  name: 'Site Logic',
  address: 'seu-email@gmail.com'
}
```

#### **P: Posso usar templates HTML mais complexos?**
**R:** Sim! Recomendo usar bibliotecas como:
- **Handlebars** (templates)
- **MJML** (emails responsivos)
- **React Email** (componentes React)

#### **P: Como adicionar imagens nos emails?**
**R:** Use URLs públicas ou anexe como `cid`:
```typescript
html: '<img src="cid:logo"/>',
attachments: [{
  filename: 'logo.png',
  path: '/path/to/logo.png',
  cid: 'logo'
}]
```

---

### 🔍 Monitoramento

#### **P: Como rastrear se o cliente abriu o email?**
**R:** Gmail API não suporta tracking nativo. Use:
- **SendGrid** (tem tracking de abertura/clique)
- Pixel de rastreamento (imagem 1x1 invisível)
- Link de rastreamento customizado

#### **P: Como sei se houve erro no envio?**
**R:** Use try/catch e log os erros:
```typescript
try {
  await this.transporter.sendMail(mailOptions);
  console.log('✅ Email enviado');
} catch (error) {
  console.error('❌ Erro ao enviar email:', error);
  // Salvar no banco para retry
}
```

---

### 🌐 Internacionalização

#### **P: Posso enviar emails em outros idiomas?**
**R:** Sim! Basta alterar o conteúdo HTML. Use bibliotecas como `i18n` para gerenciar traduções.

#### **P: Como lidar com caracteres especiais (acentos)?**
**R:** Nodemailer já trata automaticamente. Use charset UTF-8:
```typescript
headers: {
  'Content-Type': 'text/html; charset=UTF-8'
}
```

---

### 🚀 Performance

#### **P: Enviar email bloqueia a resposta da API?**
**R:** No código atual, o email é enviado em background (`catch` silencioso). Para alta performance, use filas:
```bash
npm install @nestjs/bull bull
```

#### **P: Como enviar emails em massa eficientemente?**
**R:** Use filas (Bull + Redis) ou serviços especializados (SendGrid, Mailgun).

---

### 📞 Suporte

#### **P: Onde encontro ajuda se algo der errado?**
**R:**
- 📖 Documentação: `EMAIL_SETUP.md`, `GOOGLE_CLOUD_SETUP.md`
- 🧪 Teste: `npm run test:email`
- 🌐 Google Cloud: https://support.google.com/
- 📚 Nodemailer: https://nodemailer.com/
- 💬 Stack Overflow: tag `nodemailer` + `gmail-api`

---

## 💡 Dicas Pro

1. **Use templates externos** (HTML separado do código)
2. **Implemente retry** para falhas temporárias
3. **Adicione logging estruturado** (Winston, Pino)
4. **Configure alertas** se emails não enviarem
5. **Teste em staging** antes de produção
6. **Mantenha fallback** (SendGrid como backup)
7. **Monitore quota** do Gmail (500/dia)
8. **Valide emails** antes de enviar (sintaxe)
9. **Use filas** para volumes altos
10. **Configure SPF/DKIM** em produção

---

**Última atualização**: 14/11/2025
