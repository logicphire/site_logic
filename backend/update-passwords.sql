-- Atualizar usuários sem senha para terem senha padrão
UPDATE users 
SET password = 'senha123' 
WHERE password IS NULL;
