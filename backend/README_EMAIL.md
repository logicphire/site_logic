# 📧 Configuração Gmail API - Resumo Executivo

## 🎯 Objetivo
Configurar sua aplicação NestJS para enviar emails usando a **Gmail API** com **OAuth2** através do **Google Cloud Platform**.

---

## 📚 Documentação Criada

1. **`EMAIL_SETUP.md`** - Guia detalhado passo a passo com screenshots
2. **`GOOGLE_CLOUD_SETUP.md`** - Checklist rápido e troubleshooting
3. **`test-gmail.ts`** - Script para testar a configuração
4. **`.env.example`** - Template com as variáveis necessárias

---

## 🔧 O que foi Alterado no Código

### ✅ `src/email/email.service.ts`
**Antes:**
```typescript
this.transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,  // ❌ Senha de app (menos seguro)
  },
});
```

**Depois:**
```typescript
this.transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',  // ✅ OAuth2 (mais seguro)
    user: process.env.GMAIL_USER,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  },
});
```

---

## 🚀 Como Configurar (Resumo Ultra Rápido)

### 1. Google Cloud Platform (15 min)
```
1. Criar projeto: https://console.cloud.google.com/
2. Ativar Gmail API
3. Criar credenciais OAuth 2.0
4. Copiar: Client ID + Client Secret
```

### 2. OAuth Playground (5 min)
```
1. Acessar: https://developers.google.com/oauthplayground
2. Configurar com suas credenciais
3. Autorizar: https://mail.google.com/
4. Copiar: Refresh Token
```

### 3. Configurar .env (2 min)
```env
GMAIL_CLIENT_ID=xxx.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=xxx
GMAIL_REFRESH_TOKEN=xxx
GMAIL_USER=seu-email@gmail.com
EMAIL_ORCAMENTOS=seu-email@gmail.com
```

### 4. Testar (1 min)
```bash
cd backend
npx ts-node test-gmail.ts
```

✅ Se aparecer "Email enviado com sucesso!", está tudo configurado!

---

## 🔐 Vantagens do OAuth2 vs Senha de App

| Recurso | Senha de App | OAuth2 |
|---------|-------------|--------|
| **Segurança** | ⚠️ Média | ✅ Alta |
| **Revogação** | ❌ Difícil | ✅ Fácil (pelo GCP) |
| **Auditoria** | ❌ Limitada | ✅ Completa no GCP |
| **Limite** | 500 emails/dia | 500-2000 emails/dia |
| **Google Workspace** | ⚠️ Sendo descontinuado | ✅ Recomendado |
| **Tokens** | Senha estática | Refresh Token (não expira) |

---

## 📊 Limites de Envio

- **Gmail Pessoal**: 500 emails/dia
- **Google Workspace**: 2000 emails/dia
- **Alternativas para + volume**: SendGrid, AWS SES, Mailgun

---

## 🧪 Testar o Sistema Completo

1. Reinicie o backend:
   ```bash
   cd backend
   npm run start:dev
   ```

2. Acesse o frontend: `http://localhost:5173`

3. Preencha o formulário de orçamento

4. Verifique seu email:
   - 📧 Você (empresa) receberá: "🆕 Novo Orçamento - [Nome do Cliente]"
   - 📧 Cliente receberá: "✅ Orçamento Recebido - Site Logic"

---

## ⚠️ Troubleshooting Rápido

| Erro | Solução |
|------|---------|
| `invalid_grant` | Regenere o Refresh Token |
| `insufficient permissions` | Adicione escopo `https://mail.google.com/` |
| `Invalid login` | Verifique GMAIL_USER |
| Emails não enviam | Verifique logs do backend + variáveis .env |

---

## 📞 Próximos Passos

- [ ] Configurar Google Cloud Platform
- [ ] Obter credenciais OAuth2
- [ ] Preencher arquivo `.env`
- [ ] Executar `test-gmail.ts`
- [ ] Testar formulário de orçamento
- [ ] (Opcional) Publicar app OAuth para remover aviso de segurança

---

## 💡 Dica Final

O Refresh Token **não expira**, então você só precisa fazer essa configuração **uma vez**! Depois disso, sua aplicação vai enviar emails automaticamente sem intervenção manual. 🎉

---

**Tempo Total Estimado**: 20-30 minutos
**Dificuldade**: ⭐⭐⭐ (Média)
**Benefício**: 🚀🚀🚀🚀🚀 (Muito Alto)
