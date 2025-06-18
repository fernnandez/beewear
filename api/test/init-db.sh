#!/bin/bash
set -e # Sai imediatamente se um comando falhar

# Aguarda até que o serviço de banco de dados esteja pronto
# Isso é opcional, mas pode ajudar em ambientes com inicialização lenta
# while ! pg_isready -h localhost -p 5432 -U "${POSTGRES_USER}"; do
#   echo "Aguardando o PostgreSQL..."
#   sleep 1
# done

echo "Criando o banco de dados 'test' se ele não existir..."

# Tenta conectar ao banco padrão (template1 ou postgres) e cria o banco 'test'
# if ! psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
#   CREATE DATABASE test WITH OWNER $POSTGRES_USER ENCODING 'UTF8' LC_COLLATE 'en_US.utf8' LC_CTYPE 'en_US.utf8';
# EOSQL
# then
#   echo "Banco de dados 'test' já existe ou houve um erro."
# fi

# A forma mais robusta de criar banco de dados de forma idempotente é:
# 1. Conectar ao banco 'postgres' (ou 'template1')
# 2. Verificar se 'test' existe
# 3. Criar 'test' se não existir

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    SELECT 'CREATE DATABASE test WITH OWNER $POSTGRES_USER ENCODING ''UTF8'' LC_COLLATE ''en_US.utf8'' LC_CTYPE ''en_US.utf8'';'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'test')\gexec
EOSQL

echo "Banco de dados 'test' verificado/criado."

# Se você tiver outras configurações SQL que PRECISAM ser aplicadas após o banco 'test' ser criado
# e que não devem ser executadas no banco 'db':
# psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "test" <<-EOSQL
#   -- Adicione SQL específico para o banco 'test' aqui, como criar extensões, funções, etc.
#   -- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
# EOSQL