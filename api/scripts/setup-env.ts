import * as fs from 'fs';
import * as path from 'path';

/**
 * Script para configurar variáveis de ambiente para seeding
 */
export function setupEnvironment() {
  const envFile = path.join(__dirname, '../.env');

  // Verificar se o arquivo .env existe
  if (!fs.existsSync(envFile)) {
    console.log('❌ Arquivo .env não encontrado. Criando...');

    // Criar arquivo .env baseado no env.example
    const envExample = path.join(__dirname, '../env.example');
    if (fs.existsSync(envExample)) {
      fs.copyFileSync(envExample, envFile);
      console.log('✅ Arquivo .env criado baseado no env.example');
    } else {
      console.log('❌ Arquivo env.example não encontrado');
      return;
    }
  }

  // Ler configurações atuais
  const envContent = fs.readFileSync(envFile, 'utf8');

  // Configurações para desenvolvimento
  const devConfig = {
    NODE_ENV: 'development',
    API_BASE_URL: 'http://localhost:3000',
    DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/db',
  };

  // Configurações para produção
  const prodConfig = {
    NODE_ENV: 'production',
    API_BASE_URL: process.env.API_BASE_URL || 'https://your-api-domain.com',
    DATABASE_URL:
      process.env.DATABASE_URL || 'postgres://user:pass@host:5432/db',
  };

  // Determinar qual configuração usar
  const isProduction = process.env.NODE_ENV === 'production';
  const config = isProduction ? prodConfig : devConfig;

  console.log(
    `🔧 Configurando ambiente para: ${isProduction ? 'PRODUÇÃO' : 'DESENVOLVIMENTO'}`,
  );
  console.log(`📡 API Base URL: ${config.API_BASE_URL}`);
  console.log(
    `🗄️  Database: ${config.DATABASE_URL.split('@')[1] || 'localhost'}`,
  );

  // Atualizar variáveis de ambiente
  process.env.NODE_ENV = config.NODE_ENV;
  process.env.API_BASE_URL = config.API_BASE_URL;
  process.env.DATABASE_URL = config.DATABASE_URL;

  return config;
}

/**
 * Verifica se as configurações do Cloudinary estão presentes
 */
export function checkCloudinaryConfig(): boolean {
  const requiredVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.log(
      '⚠️  Variáveis do Cloudinary não configuradas:',
      missingVars.join(', '),
    );
    console.log('📝 Usando armazenamento local para desenvolvimento');
    return false;
  }

  console.log('✅ Configurações do Cloudinary encontradas');
  return true;
}

/**
 * Exibe informações sobre a estratégia de armazenamento
 */
export function displayStorageStrategy() {
  const isProduction = process.env.NODE_ENV === 'production';
  const hasCloudinary = checkCloudinaryConfig();

  console.log('\n📊 Estratégia de Armazenamento:');
  console.log('================================');

  if (isProduction && hasCloudinary) {
    console.log('🌐 AMBIENTE: Produção');
    console.log('☁️  ARMAZENAMENTO: Cloudinary');
    console.log('🔗 URLs: URLs completas do Cloudinary');
  } else {
    console.log('💻 AMBIENTE: Desenvolvimento');
    console.log('📁 ARMAZENAMENTO: Local (pasta test/utils/files)');
    console.log('🔗 URLs: URLs locais (http://localhost:3000/uploads/images/)');
  }

  console.log('================================\n');
}
