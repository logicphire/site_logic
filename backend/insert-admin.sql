-- Deletar usuário existente se houver
DELETE FROM users WHERE email = 'admin@site.com';

-- Inserir novo usuário admin
INSERT INTO users (firebase_uid, email, nome, password, role, created_at, updated_at)
VALUES ('temp_admin_123', 'admin@site.com', 'Administrador', 'admin123', 'admin', NOW(), NOW());
