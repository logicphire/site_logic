# 🎯 ONDE COLOCAR CADA DADO - Guia Visual

## 📍 Mapa Completo: De Onde Vem → Para Onde Vai

---

## 1️⃣ GOOGLE CLOUD CONSOLE → Client ID e Client Secret

### 🌐 De Onde:
```
https://console.cloud.google.com/
  ↓
APIs e Serviços
  ↓
Credenciais
  ↓
Criar Credenciais → ID do cliente OAuth
  ↓
[Aqui você COPIA dois valores]
```

### 📋 O que Copiar:
- ✅ **ID do cliente** (termina com `.apps.googleusercontent.com`)
- ✅ **Chave secreta do cliente** (string aleatória)

### 📁 Para Onde:
Abra o arquivo: **`c:\Users\Gilberto\site_logic\backend\.env`**

```env
# Cole aqui o ID do cliente ↓
GMAIL_CLIENT_ID=123456789-abc123.apps.googleusercontent.com

# Cole aqui a chave secreta ↓
GMAIL_CLIENT_SECRET=GOCSPX-abc123xyz789
```

---

## 2️⃣ OAUTH PLAYGROUND → Refresh Token

### 🌐 De Onde:
```
https://developers.google.com/oauthplayground
  ↓
Configurações (ícone ⚙️)
  ↓
Use your own OAuth credentials
  ↓
[Cole Client ID e Client Secret aqui primeiro]
  ↓
Authorize APIs
  ↓
Exchange authorization code for tokens
  ↓
[Aqui você COPIA o Refresh Token]
```

### 📋 O que Copiar:
- ✅ **Refresh token** (string longa começando com `1//`)

### 📁 Para Onde:
No mesmo arquivo: **`c:\Users\Gilberto\site_logic\backend\.env`**

```env
# Cole aqui o Refresh Token ↓
GMAIL_REFRESH_TOKEN=1//0gABC123xyz789-abc_def_ghi_jkl_mno_pqr_stu_vwx_yz
```

---

## 3️⃣ SUA CONTA GMAIL → Email

### 📧 Qual Email:
- ✅ O email da conta Gmail que você usou para fazer login no OAuth Playground
- ✅ Esse email vai **ENVIAR** os emails do sistema

### 📁 Para Onde:
No mesmo arquivo: **`c:\Users\Gilberto\site_logic\backend\.env`**

```env
# Cole seu email aqui ↓
GMAIL_USER=seu-email@gmail.com

# Email que vai RECEBER os orçamentos (pode ser o mesmo) ↓
EMAIL_ORCAMENTOS=seu-email@gmail.com
```

---

## 📄 ARQUIVO FINAL: `.env`

### 📍 Localização:
```
c:\Users\Gilberto\site_logic\backend\.env
```

### ✏️ Como Criar:

#### Opção 1: Copiar o template
```powershell
# No PowerShell, dentro da pasta backend:
cd c:\Users\Gilberto\site_logic\backend
copy .env.example .env
```

#### Opção 2: Criar manualmente
1. Abra o VS Code
2. Clique com botão direito na pasta `backend`
3. **New File** → digite `.env`
4. Cole o conteúdo abaixo:

### 📝 Conteúdo Completo do `.env`:

```env
# ========================================
# Gmail API Configuration (OAuth2)
# ========================================

# 1️⃣ Client ID (do Google Cloud Console)
GMAIL_CLIENT_ID=cole-seu-client-id-aqui.apps.googleusercontent.com

# 2️⃣ Client Secret (do Google Cloud Console)
GMAIL_CLIENT_SECRET=cole-seu-client-secret-aqui

# 3️⃣ Refresh Token (do OAuth Playground)
GMAIL_REFRESH_TOKEN=cole-seu-refresh-token-aqui

# 4️⃣ Seu email Gmail (que vai enviar)
GMAIL_USER=seu-email@gmail.com

# 5️⃣ Email que vai receber orçamentos (pode ser o mesmo)
EMAIL_ORCAMENTOS=seu-email@gmail.com

# ========================================
# Outras Configurações (já existentes)
# ========================================
CORS_ORIGIN=http://localhost:5173
DATABASE_URL="postgresql://usuario:senha@localhost:5432/site_logic_db"
JWT_SECRET=sua-chave-secreta-super-segura
```

---

## 🎯 Exemplo Completo Preenchido

### ❌ ANTES (vazio):
```env
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=
GMAIL_USER=
EMAIL_ORCAMENTOS=
```

### ✅ DEPOIS (preenchido):
```env
GMAIL_CLIENT_ID=123456789012-abc123def456ghi789jkl.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
GMAIL_REFRESH_TOKEN=1//0gABC123-DEF456_GHI789_JKL012_MNO345_PQR678_STU901_VWX234
GMAIL_USER=gilberto@gmail.com
EMAIL_ORCAMENTOS=gilberto@gmail.com
```

---

## ⚠️ IMPORTANTE: Checklist

Antes de salvar o `.env`, verifique:

- [ ] ✅ Arquivo está em: `backend/.env` (não `backend/src/.env`)
- [ ] ✅ Client ID termina com `.apps.googleusercontent.com`
- [ ] ✅ Client Secret começa com `GOCSPX-` ou é uma string longa
- [ ] ✅ Refresh Token começa com `1//`
- [ ] ✅ GMAIL_USER é um email válido do Gmail
- [ ] ✅ EMAIL_ORCAMENTOS é um email válido (pode ser o mesmo)
- [ ] ✅ **NÃO tem espaços** antes ou depois dos valores
- [ ] ✅ **NÃO tem aspas** nos valores

---

## 🧪 Testar Depois de Preencher

```powershell
# 1. Abra o PowerShell na pasta backend
cd c:\Users\Gilberto\site_logic\backend

# 2. Execute o teste
npm run test:email
```

### ✅ Se deu certo, você verá:
```
🚀 Iniciando teste de envio de email com Gmail API...
✅ Todas as variáveis de ambiente estão configuradas
📤 Enviando email de teste...
✅ Email enviado com sucesso!
🎉 Configuração validada! Verifique sua caixa de entrada.
```

### ❌ Se deu erro:
- Verifique se copiou os valores **sem espaços** extras
- Confirme que o Refresh Token está completo (é bem longo!)
- Veja se usou o mesmo email em todos os passos do GCP

---

## 📸 Resumo Visual

```
┌─────────────────────────────────────────────────────────┐
│         Google Cloud Console                            │
│  https://console.cloud.google.com/                      │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Credenciais                                     │   │
│  │                                                  │   │
│  │  Client ID: 123...googleusercontent.com  [COPIAR]  │
│  │  Client Secret: GOCSPX-abc123...         [COPIAR]  │
│  └─────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────┘
                        │ COLAR EM ↓
                        ↓
┌─────────────────────────────────────────────────────────┐
│         OAuth Playground                                 │
│  https://developers.google.com/oauthplayground          │
│                                                          │
│  ⚙️ Configurações:                                      │
│    Client ID: [COLAR AQUI]                              │
│    Client Secret: [COLAR AQUI]                          │
│                                                          │
│  Resultado:                                             │
│    Refresh Token: 1//0gABC...                [COPIAR]   │
└───────────────────────┬─────────────────────────────────┘
                        │ COLAR EM ↓
                        ↓
┌─────────────────────────────────────────────────────────┐
│         Arquivo .env                                     │
│  c:\Users\Gilberto\site_logic\backend\.env              │
│                                                          │
│  GMAIL_CLIENT_ID=[COLAR DO GCP]                         │
│  GMAIL_CLIENT_SECRET=[COLAR DO GCP]                     │
│  GMAIL_REFRESH_TOKEN=[COLAR DO PLAYGROUND]              │
│  GMAIL_USER=seu-email@gmail.com                         │
│  EMAIL_ORCAMENTOS=seu-email@gmail.com                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Próximo Passo

Depois de preencher o `.env`:

1. ✅ Salve o arquivo (Ctrl + S)
2. ✅ Execute: `npm run test:email`
3. ✅ Verifique sua caixa de entrada

**Pronto! Sistema configurado! 🚀**
