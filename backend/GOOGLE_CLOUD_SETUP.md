# 🚀 Configuração Rápida - Gmail API com Google Cloud Platform

## ✅ O que já foi feito:

1. ✅ Código atualizado para usar OAuth2 (Gmail API)
2. ✅ EmailService configurado com autenticação OAuth2
3. ✅ Template `.env.example` atualizado

## 📋 Checklist - O que você precisa fazer:

### 1️⃣ Criar Projeto no Google Cloud
- [ ] Acessar: https://console.cloud.google.com/
- [ ] Criar novo projeto: `site-logic-email`
- [ ] Selecionar o projeto criado

### 2️⃣ Ativar Gmail API
- [ ] Ir em: APIs e Serviços → Biblioteca
- [ ] Procurar: "Gmail API"
- [ ] Clicar em "Ativar"

### 3️⃣ Configurar OAuth 2.0
- [ ] Ir em: APIs e Serviços → Tela de consentimento OAuth
- [ ] Tipo: **Externo**
- [ ] Nome: "Site Logic Email Sender"
- [ ] Email de suporte: seu-email@gmail.com
- [ ] Adicionar escopo: `https://mail.google.com/`
- [ ] Adicionar usuário de teste: seu-email@gmail.com

### 4️⃣ Criar Credenciais
- [ ] Ir em: APIs e Serviços → Credenciais
- [ ] Criar: ID do cliente OAuth
- [ ] Tipo: Aplicativo da Web
- [ ] URI de redirecionamento: `https://developers.google.com/oauthplayground`
- [ ] **Copiar**: Client ID e Client Secret

### 5️⃣ Gerar Refresh Token
- [ ] Acessar: https://developers.google.com/oauthplayground
- [ ] Clicar no ícone ⚙️ (configurações)
- [ ] Marcar: "Use your own OAuth credentials"
- [ ] Colar: Client ID e Client Secret
- [ ] Selecionar escopo: `https://mail.google.com/`
- [ ] Clicar: "Authorize APIs"
- [ ] Fazer login com sua conta Gmail
- [ ] Clicar: "Exchange authorization code for tokens"
- [ ] **Copiar**: Refresh Token

### 6️⃣ Configurar `.env`
- [ ] Criar arquivo `backend/.env` (copiar de `.env.example`)
- [ ] Preencher as variáveis:

```env
GMAIL_CLIENT_ID=seu-client-id-aqui.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=seu-client-secret-aqui
GMAIL_REFRESH_TOKEN=seu-refresh-token-aqui
GMAIL_USER=seu-email@gmail.com
EMAIL_ORCAMENTOS=seu-email@gmail.com
```

### 7️⃣ Testar o Sistema
- [ ] Reiniciar o backend: `npm run start:dev`
- [ ] Enviar um orçamento pelo frontend
- [ ] Verificar se recebeu 2 emails:
  - 📧 Notificação para empresa (EMAIL_ORCAMENTOS)
  - 📧 Confirmação para cliente

---

## 🔗 Links Importantes

- **Google Cloud Console**: https://console.cloud.google.com/
- **OAuth Playground**: https://developers.google.com/oauthplayground
- **Documentação Gmail API**: https://developers.google.com/gmail/api
- **Guia Detalhado**: Ver arquivo `EMAIL_SETUP.md`

---

## ⚠️ Problemas Comuns

### Erro: "invalid_grant"
- ✅ Regenere o Refresh Token no OAuth Playground
- ✅ Certifique-se de usar a mesma conta Gmail

### Erro: "insufficent permissions"
- ✅ Verifique se o escopo `https://mail.google.com/` foi adicionado
- ✅ Refaça a autorização no OAuth Playground

### Emails não estão enviando
- ✅ Verifique se todas as variáveis do `.env` estão corretas
- ✅ Verifique os logs do console do backend
- ✅ Confirme que o projeto GCP está ativo

---

## 📊 Limites do Gmail API

- **Contas Pessoais**: 500 emails/dia
- **Google Workspace**: 2000 emails/dia
- Para volumes maiores, considere: SendGrid, AWS SES, Mailgun

---

## 🎯 Próximos Passos (Opcional)

1. **Publicar App OAuth** (para remover tela de aviso)
2. **Adicionar templates de email customizados**
3. **Implementar fila de envio** (Bull/Redis)
4. **Monitoramento de entregas**
