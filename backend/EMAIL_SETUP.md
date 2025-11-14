# Configuração de Email com Google Cloud Platform (Gmail API)

## 🚀 Passo a Passo Completo para Configurar Gmail API

### 1. Criar Projeto no Google Cloud Platform

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em **"Selecionar um projeto"** → **"Novo Projeto"**
3. Nome do projeto: `site-logic-email` (ou outro de sua preferência)
4. Clique em **"Criar"**
5. Aguarde a criação e selecione o projeto criado

### 2. Ativar a Gmail API

1. No menu lateral, vá em **"APIs e Serviços"** → **"Biblioteca"**
2. Procure por **"Gmail API"**
3. Clique em **"Gmail API"**
4. Clique no botão **"Ativar"**

### 3. Configurar Tela de Consentimento OAuth

1. No menu lateral, vá em **"APIs e Serviços"** → **"Tela de consentimento OAuth"**
2. Selecione **"Externo"** e clique em **"Criar"**
3. Preencha as informações:
   - **Nome do app**: Site Logic Email Sender
   - **E-mail de suporte do usuário**: seu-email@gmail.com
   - **Domínios autorizados**: (pode deixar em branco)
   - **E-mail do desenvolvedor**: seu-email@gmail.com
4. Clique em **"Salvar e Continuar"**
5. Em **"Escopos"**, clique em **"Adicionar ou Remover Escopos"**
6. Procure e adicione: **`https://mail.google.com/`** (acesso completo ao Gmail)
7. Clique em **"Salvar e Continuar"**
8. Em **"Usuários de teste"**, adicione o email que vai enviar os emails
9. Clique em **"Salvar e Continuar"**

### 4. Criar Credenciais OAuth 2.0

1. No menu lateral, vá em **"APIs e Serviços"** → **"Credenciais"**
2. Clique em **"+ Criar Credenciais"** → **"ID do cliente OAuth"**
3. Selecione:
   - **Tipo de aplicativo**: Aplicativo da Web
   - **Nome**: Site Logic NestJS App
4. Em **"URIs de redirecionamento autorizados"**, adicione:
   ```
   https://developers.google.com/oauthplayground
   ```
5. Clique em **"Criar"**
6. **IMPORTANTE**: Copie e salve:
   - ✅ **ID do cliente** (Client ID)
   - ✅ **Chave secreta do cliente** (Client Secret)

### 5. Gerar Refresh Token usando OAuth Playground

1. Acesse: [OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
2. Clique no ícone de **⚙️ (engrenagem)** no canto superior direito
3. Marque a opção **"Use your own OAuth credentials"**
4. Cole:
   - **OAuth Client ID**: (cole o Client ID copiado)
   - **OAuth Client Secret**: (cole o Client Secret copiado)
5. Feche as configurações
6. No painel esquerdo, procure por **"Gmail API v1"**
7. Selecione: **`https://mail.google.com/`**
8. Clique em **"Authorize APIs"**
9. Faça login com a conta Gmail que vai enviar emails
10. Clique em **"Permitir"**
11. Clique em **"Exchange authorization code for tokens"**
12. **IMPORTANTE**: Copie o **Refresh Token** gerado

### 6. Configurar o arquivo `.env`

Crie/edite o arquivo `.env` na pasta `backend`:

```env
# Gmail API OAuth2 Configuration
GMAIL_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=seu-client-secret
GMAIL_REFRESH_TOKEN=seu-refresh-token
GMAIL_USER=seu-email@gmail.com

# Email para receber orçamentos
EMAIL_ORCAMENTOS=seu-email@gmail.com
```

### 7. Instalar Dependências

```bash
cd backend
npm install nodemailer
npm install @types/nodemailer --save-dev
```

---

## 📝 Notas Importantes

- ✅ O Refresh Token **não expira** (a menos que seja revogado)
- ✅ Mantenha as credenciais **seguras** e **nunca faça commit** do arquivo `.env`
- ✅ Para uso em produção, considere publicar o app OAuth (processo de verificação do Google)
- ✅ O limite de envio do Gmail é **500 emails/dia** para contas pessoais
- ✅ Para maior volume, considere usar **Google Workspace** ou serviços como **SendGrid**

---

## 🔧 Alternativas (Desenvolvimento/Testes)

### **Mailtrap (Recomendado para Testes)**
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=seu-usuario-mailtrap
SMTP_PASS=sua-senha-mailtrap
```

### **SendGrid (Produção)**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=sua-api-key-sendgrid
```

#### **Outlook/Hotmail**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=seuemail@outlook.com
SMTP_PASS=sua-senha
```

### 4. Testar o envio

Após configurar, reinicie o servidor backend:
```bash
npm run start:dev
```

E teste enviando um orçamento pelo formulário!

## 📧 Emails que serão enviados:

1. **Email para a empresa** (EMAIL_ORCAMENTOS):
   - Notificação de novo orçamento
   - Todos os detalhes do cliente e projeto
   - Link para o painel admin

2. **Email para o cliente**:
   - Confirmação de recebimento
   - Resumo do orçamento
   - Próximos passos
   - Informações de contato

## ⚠️ Importante:

- **NÃO** commite o arquivo `.env` no Git
- Use senhas de app, nunca a senha principal da conta
- Para produção, considere usar serviços como SendGrid, AWS SES ou Postmark
