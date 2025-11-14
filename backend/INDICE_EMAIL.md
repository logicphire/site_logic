# 📧 Documentação Completa - Sistema de Envio de Emails

## 📚 Índice de Documentação

### 🚀 Começando

1. **[GUIA_RAPIDO.md](./GUIA_RAPIDO.md)** - ⭐ **COMECE AQUI!**
   - Guia visual em 3 passos (18 minutos)
   - Passo a passo ilustrado
   - Checklist completo
   - **Recomendado para primeira configuração**

2. **[README_EMAIL.md](./README_EMAIL.md)** - Resumo Executivo
   - Visão geral do projeto
   - O que foi alterado no código
   - Comparação OAuth2 vs Senha de App
   - Limites e alternativas

### 📖 Guias Detalhados

3. **[EMAIL_SETUP.md](./EMAIL_SETUP.md)** - Guia Completo
   - Configuração detalhada do Google Cloud Platform
   - Passo a passo com descrições completas
   - Configuração do OAuth 2.0
   - Geração de Refresh Token
   - Alternativas (Mailtrap, SendGrid)

4. **[GOOGLE_CLOUD_SETUP.md](./GOOGLE_CLOUD_SETUP.md)** - Checklist + Troubleshooting
   - Checklist rápido de configuração
   - Links importantes
   - Problemas comuns e soluções
   - Próximos passos opcionais

### 🧪 Testes e Scripts

5. **[test-gmail.ts](./test-gmail.ts)** - Script de Teste
   - Valida configuração completa
   - Envia email de teste
   - Diagnóstico de problemas
   - **Execute**: `npm run test:email`

### ❓ Ajuda e Referência

6. **[FAQ_EMAIL.md](./FAQ_EMAIL.md)** - Perguntas Frequentes
   - Segurança e credenciais
   - Limites de envio
   - Problemas comuns
   - Recursos avançados
   - Dicas de produção

### 📁 Arquivos de Configuração

7. **[.env.example](./.env.example)** - Template de Variáveis
   - Todas as variáveis necessárias
   - Comentários explicativos
   - Valores de exemplo

---

## 🎯 Fluxo de Configuração Recomendado

```
1. Leia: GUIA_RAPIDO.md (5 min)
   ↓
2. Siga: Os 3 passos do guia (18 min)
   ↓
3. Execute: npm run test:email (1 min)
   ↓
4. Teste: Formulário de orçamento no frontend (2 min)
   ↓
5. Consulte: FAQ_EMAIL.md (se tiver dúvidas)
```

---

## 🔍 Encontre o que Precisa

| Se você quer... | Leia este arquivo |
|-----------------|-------------------|
| 🚀 Começar rápido | `GUIA_RAPIDO.md` |
| 📖 Entender tudo em detalhes | `EMAIL_SETUP.md` |
| ✅ Checklist para não esquecer nada | `GOOGLE_CLOUD_SETUP.md` |
| 🧪 Testar se está funcionando | `test-gmail.ts` + `npm run test:email` |
| ❓ Tirar dúvidas específicas | `FAQ_EMAIL.md` |
| 📊 Ver resumo executivo | `README_EMAIL.md` |
| ⚙️ Copiar template .env | `.env.example` |

---

## 📊 Estrutura do Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  - Formulário de Orçamento (src/pages/Orcamento.tsx)   │
└────────────────────┬────────────────────────────────────┘
                     │ POST /orcamentos
                     ↓
┌─────────────────────────────────────────────────────────┐
│              Backend (NestJS) - Port 5000                │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  OrcamentosController                            │   │
│  │  - Recebe dados do formulário                    │   │
│  └────────────────────┬─────────────────────────────┘   │
│                       ↓                                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │  OrcamentosService                               │   │
│  │  - Salva no banco de dados (Prisma)             │   │
│  │  - Chama EmailService                            │   │
│  └────────────────────┬─────────────────────────────┘   │
│                       ↓                                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │  EmailService (src/email/email.service.ts)      │   │
│  │  - Usa Nodemailer com OAuth2                     │   │
│  │  - Envia 2 emails:                               │   │
│  │    1. Para empresa (notificação)                 │   │
│  │    2. Para cliente (confirmação)                 │   │
│  └────────────────────┬─────────────────────────────┘   │
│                       ↓                                  │
└───────────────────────┼──────────────────────────────────┘
                        │ OAuth2 Authentication
                        ↓
┌─────────────────────────────────────────────────────────┐
│              Google Cloud Platform                       │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Gmail API                                       │   │
│  │  - Valida credenciais OAuth2                     │   │
│  │  - Processa envio de emails                      │   │
│  │  - Limite: 500 emails/dia                        │   │
│  └────────────────────┬─────────────────────────────┘   │
│                       ↓                                  │
└───────────────────────┼──────────────────────────────────┘
                        │ SMTP
                        ↓
                   📧 Gmail
            (Caixa de entrada do destinatário)
```

---

## 🔐 Credenciais Necessárias

| Variável | Obtida em | Descrito em |
|----------|-----------|-------------|
| `GMAIL_CLIENT_ID` | Google Cloud Console | `EMAIL_SETUP.md` (Passo 4) |
| `GMAIL_CLIENT_SECRET` | Google Cloud Console | `EMAIL_SETUP.md` (Passo 4) |
| `GMAIL_REFRESH_TOKEN` | OAuth Playground | `EMAIL_SETUP.md` (Passo 5) |
| `GMAIL_USER` | Sua conta Gmail | - |
| `EMAIL_ORCAMENTOS` | Email para receber | - |

---

## 🧪 Comandos Úteis

```bash
# Testar configuração de email
npm run test:email

# Iniciar backend em desenvolvimento
npm run start:dev

# Ver arquivo .env (verificar variáveis)
type .env          # Windows
cat .env           # Linux/Mac

# Copiar template .env
copy .env.example .env    # Windows
cp .env.example .env      # Linux/Mac
```

---

## 📞 Links Importantes

- **Google Cloud Console**: https://console.cloud.google.com/
- **OAuth 2.0 Playground**: https://developers.google.com/oauthplayground
- **Gmail API Docs**: https://developers.google.com/gmail/api
- **Nodemailer Docs**: https://nodemailer.com/
- **NestJS Docs**: https://docs.nestjs.com/

---

## ✅ Status da Implementação

- ✅ EmailService criado com OAuth2
- ✅ Templates HTML responsivos
- ✅ Envio para empresa + cliente
- ✅ Integração com Orçamentos
- ✅ Variáveis de ambiente configuradas
- ✅ Script de teste criado
- ✅ Documentação completa
- ✅ FAQ extenso
- ⏳ **Aguardando**: Configuração do Google Cloud Platform (você precisa fazer)

---

## 🎯 Próximos Passos

1. [ ] Configurar Google Cloud Platform (seguir `GUIA_RAPIDO.md`)
2. [ ] Obter credenciais OAuth2
3. [ ] Preencher arquivo `.env`
4. [ ] Executar `npm run test:email`
5. [ ] Testar formulário de orçamento
6. [ ] (Opcional) Publicar app OAuth no GCP
7. [ ] (Opcional) Configurar domínio personalizado

---

## 📝 Notas de Versão

**Versão**: 1.0.0  
**Data**: 14 de Novembro de 2025  
**Autenticação**: OAuth2 com Gmail API  
**Framework**: NestJS + Nodemailer  
**Status**: Pronto para configuração  

---

## 💡 Dica Final

Não se assuste com a quantidade de documentação! Na prática, você só precisa:

1. **Ler**: `GUIA_RAPIDO.md` (5 min)
2. **Seguir**: Os 3 passos (18 min)
3. **Testar**: `npm run test:email` (1 min)

Os outros arquivos são apenas para **referência** e **troubleshooting**. 🚀

---

**Tempo Total Estimado**: 20-25 minutos  
**Dificuldade**: ⭐⭐⭐ Média  
**Benefício**: 🚀🚀🚀🚀🚀 Muito Alto

---

**Boa sorte! 🎉**
