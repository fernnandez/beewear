#!/bin/bash

echo "🚀 Configurando ambiente de desenvolvimento do BeeWear Store..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js 18+ primeiro."
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versão 18+ é necessária. Versão atual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "🔧 Criando arquivo .env..."
    cat > .env << EOF
# API Configuration
VITE_API_URL=http://localhost:3000

# App Configuration
VITE_APP_NAME=BeeWear Store
VITE_APP_VERSION=1.0.0
EOF
    echo "✅ Arquivo .env criado"
else
    echo "✅ Arquivo .env já existe"
fi

# Verificar se a API está rodando
echo "🔍 Verificando se a API está rodando..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ API detectada em http://localhost:3000"
else
    echo "⚠️  API não encontrada em http://localhost:3000"
    echo "   Certifique-se de que a API esteja rodando antes de iniciar o frontend"
fi

echo ""
echo "🎉 Configuração concluída!"
echo ""
echo "Para iniciar o servidor de desenvolvimento:"
echo "  npm run dev"
echo ""
echo "Para acessar a aplicação:"
echo "  http://localhost:5173"
echo ""
echo "📚 Para mais informações, consulte o README.md" 