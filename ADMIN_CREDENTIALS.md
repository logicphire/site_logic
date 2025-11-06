# 🔐 Credenciais do Administrador Padrão

## Usuário Admin Inicial

Após executar o seed do banco de dados, será criado automaticamente o usuário administrador padrão:

### Credenciais de Acesso:
- **Email:** `admin@sitelogic.com`
- **Senha:** `admin@2025`
- **Role:** `super_admin`

## 🚨 IMPORTANTE - Segurança

⚠️ **TROQUE ESTA SENHA IMEDIATAMENTE APÓS O PRIMEIRO LOGIN!**

Esta é uma senha padrão para configuração inicial. Por questões de segurança, você deve:

1. Fazer login com as credenciais acima
2. Acessar a página de usuários no admin
3. Editar o usuário administrador e alterar a senha
4. Criar outros usuários conforme necessário

## 📝 Como Executar o Seed

Para criar o usuário admin e popular o banco de dados:

```bash
cd backend
npx prisma migrate reset  # Limpa e recria o banco (cuidado em produção!)
# OU
npx prisma db seed  # Apenas executa o seed
```

## 👥 Criando Novos Usuários

Novos usuários devem ser criados através do painel admin:

1. Faça login como administrador
2. Acesse: **Admin → Usuários**
3. Clique em **"Novo Usuário"**
4. Preencha os dados e escolha a role apropriada

### Roles Disponíveis:
- **super_admin** - Acesso total ao sistema
- **admin** - Acesso administrativo
- **user** - Acesso limitado

## 🔒 Segurança Adicional

### Próximos Passos Recomendados:
- [ ] Implementar hash de senha com bcrypt
- [ ] Substituir tokens simples por JWT
- [ ] Adicionar autenticação de dois fatores (2FA)
- [ ] Implementar política de senhas fortes
- [ ] Adicionar logs de auditoria de acesso

---

**Data de criação:** 06/11/2025
**Sistema:** Site Logic - Plataforma de Gestão
