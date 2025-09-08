-- Ajusta timezone default para o banco inteiro
ALTER DATABASE db SET TIMEZONE TO 'UTC';

-- Opcional: também para o usuário padrão
ALTER ROLE postgres SET TIMEZONE TO 'UTC';
