# Scripts de Seed do Banco de Dados

## 🌱 Seed Database

Script único que cria todos os dados necessários para o sistema BeeWear.

### 📊 Dados Criados

- **16 usuários** (1 admin + 15 comuns)
- **~30-45 endereços** (1-3 por usuário)
- **10 coleções** com imagens
- **40+ produtos** com múltiplas variações
- **160+ variações de produto** (cores diferentes)
- **640+ itens de estoque** (4 tamanhos × 160+ variações)
- **50-100 pedidos** com itens completos

### 🚀 Como Executar

```bash
# Executar o seed
npm run seed

# Ou diretamente com ts-node
npx ts-node scripts/seed-database.ts

# Ou com yarn
yarn seed
```

### 👤 Usuários Criados

**Admin:**
- Email: `admin@beewear.com`
- Senha: `admin123`
- Role: `ADMIN`

**Usuários Comuns:**
- Email: `user1@beewear.com` até `user15@beewear.com`
- Senha: `user123`
- Role: `USER`

### 🛒 Pedidos

- **50-100 pedidos** com status variados
- **1-5 itens por pedido**
- **Métodos de pagamento**: CREDIT_CARD, KLARNA, PIX, BANK_TRANSFER
- **Status de pagamento**: PENDING, PAID, FAILED, REFUNDED
- **Endereços de entrega** baseados nos endereços dos usuários

### 📦 Produtos

- **40+ produtos** em 10 coleções diferentes
- **Múltiplas cores** por produto
- **4 tamanhos** (S, M, L, XL)
- **Estoque** de 5-100 unidades por item
- **Imagens** processadas e otimizadas

### 🏠 Endereços

- **Cidades portuguesas**: Lisboa, Porto, Braga, Coimbra, Aveiro, Faro, Setúbal, Leiria
- **Tipos**: Casa, Trabalho, Apartamento, Escritório
- **Códigos postais** no formato português

### ⚙️ Configuração

O script usa as variáveis de ambiente do arquivo `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=db
```

### 🔧 Estrutura

```
api/scripts/
├── seed-database.ts      # Script principal
├── image-seeder.service.ts # Serviço de processamento de imagens
├── setup-env.ts          # Configuração de ambiente
└── README.md            # Este arquivo
```