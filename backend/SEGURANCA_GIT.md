# 🔐 Segurança de Credenciais - Git

## ✅ Proteções Implementadas

### 1. Arquivos Protegidos pelo `.gitignore`

#### Backend (`backend/.gitignore`):
```
✅ .env
✅ .env.local
✅ .env.*.local
✅ .env.development
✅ .env.production
✅ .env.test
✅ .env.backup
✅ .env.old
✅ *.pem
✅ *.key
✅ *.p12
✅ *.pfx
```

#### Raiz (`.gitignore`):
```
✅ .env
✅ .env.local
✅ backend/.env
✅ backend/.env.local
```

---

## 🛡️ Como Funciona

### ❌ Arquivos que NUNCA vão para o Git:
- `backend/.env` → **Suas credenciais OAuth2**
- `backend/.env.local` → **Credenciais locais**
- `backend/.env.production` → **Credenciais de produção**
- Qualquer arquivo `.env.*` → **Protegido**

### ✅ Arquivos que PODEM ir para o Git:
- `backend/.env.example` → **Template sem credenciais reais**
- Arquivos de código (`*.ts`, `*.tsx`)
- Documentação (`*.md`)

---

## 🧪 Testar Proteção

### Verificar se `.env` está protegido:
```powershell
# No terminal:
cd c:\Users\Gilberto\site_logic

# Verificar se .env está sendo rastreado (deve retornar vazio):
git ls-files backend/.env

# Verificar se .env está ignorado (deve aparecer na lista):
git check-ignore backend/.env
```

### Resultado Esperado:
```
✅ git ls-files backend/.env
   → (vazio - arquivo NÃO está rastreado)

✅ git check-ignore backend/.env
   → backend/.env (arquivo está IGNORADO)
```

---

## ⚠️ E Se Eu Já Commitei o `.env` Antes?

Se você acidentalmente já fez commit do `.env` com credenciais:

### Opção 1: Remover do Histórico (Recomendado)
```powershell
# Remover .env do git (mantém o arquivo local)
git rm --cached backend/.env

# Commit da remoção
git add backend/.gitignore
git commit -m "🔒 Remove .env do Git e adiciona ao .gitignore"

# Push
git push
```

### Opção 2: Se as Credenciais Foram Expostas
```powershell
# 1. Revogar credenciais antigas:
#    - Vá ao Google Cloud Console
#    - APIs e Serviços → Credenciais
#    - Delete o Client ID antigo

# 2. Criar novas credenciais
#    - Siga o GUIA_RAPIDO.md novamente
#    - Gere novo Client ID, Secret e Refresh Token

# 3. Atualizar .env com novas credenciais

# 4. Remover .env do git
git rm --cached backend/.env
git commit -m "🔒 Remove credenciais expostas"
git push

# 5. (Opcional) Limpar histórico completamente:
#    Usar BFG Repo-Cleaner ou git filter-branch
```

---

## 📋 Checklist de Segurança

Antes de fazer `git push`, sempre verifique:

- [ ] ✅ `.env` está no `.gitignore`
- [ ] ✅ `.env` NÃO aparece no `git status`
- [ ] ✅ Apenas `.env.example` está sendo commitado
- [ ] ✅ `.env.example` NÃO tem credenciais reais
- [ ] ✅ `git ls-files backend/.env` retorna vazio

---

## 🚨 Comandos de Emergência

### Caso tenha adicionado .env acidentalmente:
```powershell
# Se ainda NÃO fez commit:
git reset backend/.env
git restore --staged backend/.env

# Se JÁ fez commit mas NÃO deu push:
git reset --soft HEAD~1  # Desfaz último commit
git reset backend/.env   # Remove .env do stage

# Se JÁ deu push:
# 1. Revogue as credenciais no GCP IMEDIATAMENTE
# 2. Siga a "Opção 2" acima
```

---

## 💡 Boas Práticas

### ✅ SEMPRE fazer:
1. Verificar `git status` antes de commit
2. Revisar arquivos com `git diff` antes de commit
3. Usar `.env.example` como template
4. Documentar variáveis necessárias
5. Manter credenciais apenas no `.env` local

### ❌ NUNCA fazer:
1. Commitar arquivos `.env`
2. Colocar credenciais em código
3. Compartilhar `.env` por email/chat
4. Fazer screenshot do `.env` com credenciais
5. Copiar `.env` para repositório público

---

## 🔍 Verificação Automatizada

Adicione ao seu fluxo de trabalho:

```powershell
# Antes de cada commit, execute:
git status

# Procure por:
❌ backend/.env (não deve aparecer)
✅ backend/.env.example (pode aparecer)
```

---

## 📊 Status Atual

### ✅ Configuração Atual:
```
✅ backend/.gitignore → Protegendo .env
✅ .gitignore (raiz) → Proteção adicional
✅ .env.example → Template disponível
✅ backend/.env → NÃO está no git
```

### 🎯 Você Está Protegido!
Suas credenciais OAuth2 estão seguras e nunca serão enviadas para o GitHub! 🔒

---

## 📞 Próximos Passos

1. ✅ Continue configurando o Gmail API normalmente
2. ✅ Preencha o `backend/.env` com suas credenciais
3. ✅ Faça commits normalmente (`.env` será ignorado)
4. ✅ Sempre use `.env.example` para documentar variáveis

**Suas credenciais estão seguras! 🛡️**
