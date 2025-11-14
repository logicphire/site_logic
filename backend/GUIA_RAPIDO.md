# 🎯 Guia Visual Rápido - Gmail API em 3 Passos

## Passo 1: Google Cloud Platform (10 min)

### 1.1 Criar Projeto
```
🌐 https://console.cloud.google.com/
   ↓
📁 "Novo Projeto"
   ↓
✏️  Nome: "site-logic-email"
   ↓
✅ "Criar"
```

### 1.2 Ativar Gmail API
```
📚 Menu: "APIs e Serviços" → "Biblioteca"
   ↓
🔍 Procurar: "Gmail API"
   ↓
✅ Clicar em "Ativar"
```

### 1.3 Configurar OAuth
```
⚙️  Menu: "APIs e Serviços" → "Tela de consentimento OAuth"
   ↓
🌍 Tipo: "Externo"
   ↓
📝 Preencher:
   - Nome: "Site Logic Email Sender"
   - Email: seu-email@gmail.com
   ↓
🔐 Adicionar escopo:
   - https://mail.google.com/
   ↓
👤 Adicionar usuário teste:
   - seu-email@gmail.com
```

### 1.4 Criar Credenciais
```
🔑 Menu: "APIs e Serviços" → "Credenciais"
   ↓
➕ "Criar Credenciais" → "ID do cliente OAuth"
   ↓
🖥️  Tipo: "Aplicativo da Web"
   ↓
🔗 URI de redirecionamento:
   - https://developers.google.com/oauthplayground
   ↓
💾 COPIAR E SALVAR:
   ✅ Client ID
   ✅ Client Secret
```

---

## Passo 2: OAuth Playground (5 min)

```
🌐 https://developers.google.com/oauthplayground
   ↓
⚙️  Clicar no ícone de engrenagem (canto superior direito)
   ↓
☑️  Marcar: "Use your own OAuth credentials"
   ↓
📋 Colar suas credenciais:
   - OAuth Client ID: [cole aqui]
   - OAuth Client Secret: [cole aqui]
   ↓
📧 Selecionar escopo:
   - Procurar: "Gmail API v1"
   - Marcar: https://mail.google.com/
   ↓
🚀 "Authorize APIs"
   ↓
🔐 Fazer login com sua conta Gmail
   ↓
✅ "Permitir"
   ↓
🔄 "Exchange authorization code for tokens"
   ↓
💾 COPIAR: Refresh Token
```

---

## Passo 3: Configurar & Testar (3 min)

### 3.1 Criar arquivo .env
```bash
# No terminal do backend:
cd c:\Users\Gilberto\site_logic\backend

# Copiar template:
copy .env.example .env

# Editar .env e preencher:
```

```env
GMAIL_CLIENT_ID=seu-client-id-aqui.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=seu-client-secret-aqui
GMAIL_REFRESH_TOKEN=seu-refresh-token-aqui
GMAIL_USER=seu-email@gmail.com
EMAIL_ORCAMENTOS=seu-email@gmail.com
```

### 3.2 Testar Configuração
```bash
# Executar teste:
npm run test:email

# OU:
npx ts-node test-gmail.ts
```

### 3.3 Resultado Esperado
```
🚀 Iniciando teste de envio de email com Gmail API...

✅ Todas as variáveis de ambiente estão configuradas

📧 Configuração do transporter:
   De: seu-email@gmail.com
   Para: seu-email@gmail.com (email de teste)

📤 Enviando email de teste...

✅ Email enviado com sucesso!

📋 Detalhes:
   Message ID: <xxxxxx@gmail.com>
   Response: 250 2.0.0 OK

🎉 Configuração validada! Verifique sua caixa de entrada.
```

---

## ✅ Checklist Final

- [ ] ✅ Projeto criado no Google Cloud
- [ ] ✅ Gmail API ativada
- [ ] ✅ OAuth configurado (tipo Externo)
- [ ] ✅ Escopo adicionado: `https://mail.google.com/`
- [ ] ✅ Credenciais criadas (Client ID + Secret)
- [ ] ✅ Refresh Token gerado no Playground
- [ ] ✅ Arquivo `.env` preenchido
- [ ] ✅ Teste executado com sucesso
- [ ] ✅ Email recebido na caixa de entrada

---

## 🎉 Pronto para Usar!

Agora seu sistema pode enviar emails automaticamente:

1. **Formulário de Orçamento** → Cliente preenche
2. **Backend processa** → Salva no banco
3. **EmailService dispara** → 2 emails enviados:
   - 📧 Para você: "🆕 Novo Orçamento - [Cliente]"
   - 📧 Para cliente: "✅ Orçamento Recebido"

---

## 🆘 Precisa de Ajuda?

- 📖 Guia detalhado: `EMAIL_SETUP.md`
- 🔧 Troubleshooting: `GOOGLE_CLOUD_SETUP.md`
- 📚 Resumo executivo: `README_EMAIL.md`
- 🧪 Script de teste: `test-gmail.ts`

---

## 📞 Comandos Úteis

```bash
# Testar email
npm run test:email

# Ver logs do backend
npm run start:dev

# Verificar .env
cat .env  # Linux/Mac
type .env  # Windows
```

---

**Tempo Total**: ~18 minutos
**Dificuldade**: ⭐⭐⭐ Média
**Impacto**: 🚀🚀🚀🚀🚀 Muito Alto
