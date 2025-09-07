import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { ImageSeederService } from './image-seeder.service';
import { setupEnvironment, displayStorageStrategy } from './setup-env';

// Importar entidades
import { User, Role } from '../src/domain/user/user.entity';
import { Address } from '../src/domain/user/address/address.entity';
import { Collection } from '../src/domain/product/collection/collection.entity';
import { Product } from '../src/domain/product/product.entity';
import { ProductVariation } from '../src/domain/product/productVariation/product-variation.entity';
import {
  ProductVariationSize,
  Size,
} from '../src/domain/product/productVariation/product-variation-size.entity';
import { StockItem } from '../src/domain/product/stock/stock-item.entity';
import { StockMovement } from '../src/domain/product/stock/stock-movement.entity';
import { Order } from '../src/domain/order/order.entity';
import { OrderItem } from '../src/domain/order/order-item.entity';
import { OrderStatus } from '../src/domain/order/enums/order-status.enum';

// Configuração do banco de dados
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'db',
  entities: [
    User,
    Address,
    Collection,
    Product,
    ProductVariation,
    ProductVariationSize,
    StockItem,
    StockMovement,
    Order,
    OrderItem,
  ],
  synchronize: true,
  logging: false,
});

// Dados expandidos para seeding completo
const expandedProducts = [
  // Roupas Básicas
  {
    name: 'Camiseta Básica',
    colors: ['Branco', 'Preto', 'Azul', 'Cinza'],
    price: 25.99,
  },
  {
    name: 'Camiseta Polo',
    colors: ['Branco', 'Preto', 'Azul', 'Verde'],
    price: 35.99,
  },
  {
    name: 'Regata Estampada',
    colors: ['Branco', 'Preto', 'Rosa', 'Azul'],
    price: 22.99,
  },
  {
    name: 'Top Cropped',
    colors: ['Branco', 'Preto', 'Rosa', 'Bege'],
    price: 19.99,
  },
  {
    name: 'Blusa de Seda',
    colors: ['Rosa', 'Branco', 'Preto', 'Azul'],
    price: 45.99,
  },
  {
    name: 'Blusa Casual',
    colors: ['Branco', 'Preto', 'Azul', 'Verde'],
    price: 32.99,
  },

  // Calças e Shorts
  {
    name: 'Calça Jeans',
    colors: ['Azul', 'Preto', 'Cinza', 'Branco'],
    price: 65.99,
  },
  {
    name: 'Calça Social',
    colors: ['Preto', 'Navy', 'Cinza', 'Bege'],
    price: 79.99,
  },
  {
    name: 'Calça Legging',
    colors: ['Preto', 'Azul', 'Rosa', 'Cinza'],
    price: 29.99,
  },
  {
    name: 'Shorts Esportivo',
    colors: ['Preto', 'Azul', 'Verde', 'Cinza'],
    price: 29.99,
  },
  {
    name: 'Shorts Casual',
    colors: ['Branco', 'Preto', 'Azul', 'Bege'],
    price: 24.99,
  },
  {
    name: 'Legging Fitness',
    colors: ['Preto', 'Azul', 'Rosa', 'Roxo'],
    price: 24.99,
  },

  // Vestidos
  {
    name: 'Vestido Elegante',
    colors: ['Preto', 'Vermelho', 'Azul', 'Verde'],
    price: 89.99,
  },
  {
    name: 'Vestido de Festa',
    colors: ['Preto', 'Vermelho', 'Azul', 'Dourado'],
    price: 149.99,
  },
  {
    name: 'Vestido Casual',
    colors: ['Branco', 'Preto', 'Azul', 'Rosa'],
    price: 55.99,
  },
  {
    name: 'Vestido Midi',
    colors: ['Preto', 'Azul', 'Verde', 'Rosa'],
    price: 69.99,
  },
  {
    name: 'Vestido Maxi',
    colors: ['Preto', 'Azul', 'Verde', 'Branco'],
    price: 95.99,
  },

  // Saias
  {
    name: 'Saia Midi',
    colors: ['Preto', 'Navy', 'Azul', 'Verde'],
    price: 35.99,
  },
  {
    name: 'Saia Mini',
    colors: ['Preto', 'Azul', 'Rosa', 'Branco'],
    price: 28.99,
  },
  {
    name: 'Saia Longa',
    colors: ['Preto', 'Azul', 'Verde', 'Rosa'],
    price: 42.99,
  },
  {
    name: 'Saia Plissada',
    colors: ['Preto', 'Azul', 'Rosa', 'Branco'],
    price: 38.99,
  },

  // Jaquetas e Blazers
  {
    name: 'Jaqueta Denim',
    colors: ['Azul', 'Preto', 'Branco', 'Verde'],
    price: 75.99,
  },
  {
    name: 'Blazer Profissional',
    colors: ['Preto', 'Navy', 'Cinza', 'Bege'],
    price: 129.99,
  },
  {
    name: 'Jaqueta de Couro',
    colors: ['Preto', 'Marrom', 'Branco'],
    price: 199.99,
  },
  {
    name: 'Jaqueta Bomber',
    colors: ['Preto', 'Azul', 'Verde', 'Rosa'],
    price: 89.99,
  },
  {
    name: 'Cardigã Confortável',
    colors: ['Bege', 'Cinza', 'Preto', 'Azul'],
    price: 55.99,
  },

  // Conjuntos e Macacões
  {
    name: 'Macacão Moderno',
    colors: ['Preto', 'Azul', 'Verde', 'Branco'],
    price: 89.99,
  },
  {
    name: 'Conjunto Esportivo',
    colors: ['Preto', 'Azul', 'Rosa', 'Verde'],
    price: 65.99,
  },
  {
    name: 'Conjunto Profissional',
    colors: ['Preto', 'Navy', 'Cinza'],
    price: 149.99,
  },

  // Roupas de Inverno
  {
    name: 'Casaco de Lã',
    colors: ['Preto', 'Cinza', 'Bege', 'Azul'],
    price: 125.99,
  },
  { name: 'Moletom', colors: ['Preto', 'Azul', 'Verde', 'Rosa'], price: 45.99 },
  {
    name: 'Sobretudo',
    colors: ['Preto', 'Navy', 'Cinza', 'Bege'],
    price: 179.99,
  },

  // Roupas de Verão
  {
    name: 'Vestido de Verão',
    colors: ['Branco', 'Azul', 'Rosa', 'Amarelo'],
    price: 55.99,
  },
  {
    name: 'Shorts de Verão',
    colors: ['Branco', 'Azul', 'Rosa', 'Verde'],
    price: 32.99,
  },
  {
    name: 'Camiseta de Verão',
    colors: ['Branco', 'Azul', 'Rosa', 'Amarelo'],
    price: 28.99,
  },

  // Acessórios
  { name: 'Cinto de Couro', colors: ['Preto', 'Marrom', 'Navy'], price: 35.99 },
  {
    name: 'Bolsa de Mão',
    colors: ['Preto', 'Marrom', 'Azul', 'Rosa'],
    price: 65.99,
  },
  {
    name: 'Mochila Casual',
    colors: ['Preto', 'Azul', 'Verde', 'Rosa'],
    price: 45.99,
  },
];

const expandedCollections = [
  {
    name: 'Essenciais Básicos',
    description: 'Peças fundamentais para o guarda-roupa',
  },
  {
    name: 'Coleção Verão 2024',
    description: 'Tendências para a estação mais quente',
  },
  {
    name: 'Elegância Profissional',
    description: 'Roupas para o ambiente corporativo',
  },
  {
    name: 'Coleção Inverno 2024',
    description: 'Peças quentes e elegantes para o frio',
  },
  {
    name: 'Fitness & Esporte',
    description: 'Roupas confortáveis para atividades físicas',
  },
  {
    name: 'Festa & Eventos',
    description: 'Looks especiais para ocasiões especiais',
  },
  {
    name: 'Casual & Conforto',
    description: 'Roupas casuais para o dia a dia',
  },
  {
    name: 'Acessórios',
    description: 'Complementos para completar seu look',
  },
  {
    name: 'Coleção Premium',
    description: 'Peças exclusivas de alta qualidade',
  },
  {
    name: 'Tendências 2024',
    description: 'As últimas tendências da moda',
  },
];

// Mock do serviço de storage para o seeder
const mockStorageService = {
  upload: async (fileBuffer: Buffer, filename: string): Promise<string> => {
    // Em desenvolvimento, retorna a URL completa da imagem
    // Em produção, seria feito upload para Cloudinary
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/images/${filename}`;
  },
  getImageUrl: (filename: string): string => {
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/images/${filename}`;
  },
  imageExists: async (filename: string): Promise<boolean> => {
    const fs = await import('fs');
    const path = await import('path');
    const imagePath = path.join(process.cwd(), 'test/utils/files', filename);
    return fs.existsSync(imagePath);
  },
};

// Instanciar o serviço de imagens
const imageSeederService = new ImageSeederService(mockStorageService as any);

// Função para truncar todas as tabelas
async function truncateTables(dataSource: DataSource) {
  console.log('🗑️  Limpando tabelas existentes...');

  // Obter todas as tabelas do banco
  const tables = await dataSource.query(`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename NOT LIKE 'pg_%'
    AND tablename NOT LIKE 'sql_%'
    ORDER BY tablename;
  `);

  if (tables.length === 0) {
    console.log('ℹ️  Nenhuma tabela encontrada para truncar');
    return;
  }

  // Desabilitar foreign key checks temporariamente
  await dataSource.query('SET session_replication_role = replica;');

  // Truncar todas as tabelas encontradas
  const tableNames = tables.map((table: any) => table.tablename);

  console.log(`📋 Encontradas ${tableNames.length} tabelas para truncar:`);
  tableNames.forEach((tableName: string) => {
    console.log(`   - ${tableName}`);
  });

  for (const tableName of tableNames) {
    try {
      await dataSource.query(
        `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`,
      );
      console.log(`✅ Tabela ${tableName} truncada`);
    } catch (error) {
      console.log(`⚠️  Erro ao truncar ${tableName}:`, error.message);
    }
  }

  // Reabilitar foreign key checks
  await dataSource.query('SET session_replication_role = DEFAULT;');
  console.log('✅ Todas as tabelas foram limpas');
}

// Função principal de seeding
async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seeding do banco de dados...');

    // Configurar ambiente
    setupEnvironment();
    displayStorageStrategy();

    await dataSource.initialize();
    console.log('✅ Conectado ao banco de dados');

    // Truncar tabelas antes de inserir novos dados
    await truncateTables(dataSource);

    const userRepository = dataSource.getRepository(User);
    const addressRepository = dataSource.getRepository(Address);
    const collectionRepository = dataSource.getRepository(Collection);
    const productRepository = dataSource.getRepository(Product);
    const productVariationRepository =
      dataSource.getRepository(ProductVariation);
    const productVariationSizeRepository =
      dataSource.getRepository(ProductVariationSize);
    const stockItemRepository = dataSource.getRepository(StockItem);
    const orderRepository = dataSource.getRepository(Order);
    const orderItemRepository = dataSource.getRepository(OrderItem);

    // 1. Criar usuários (mais usuários)
    console.log('👤 Criando usuários...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = userRepository.create({
      name: 'Administrador',
      email: 'admin@beewear.com',
      password: hashedPassword,
      role: Role.ADMIN,
    });
    await userRepository.save(adminUser);
    console.log('✅ Usuário admin criado (admin@beewear.com / admin123)');

    // Criar usuários comuns
    const users: User[] = [];
    const userNames = [
      'João Silva',
      'Maria Santos',
      'Ana Costa',
      'Pedro Oliveira',
      'Carla Ferreira',
      'Rafael Lima',
      'Juliana Alves',
      'Marcos Souza',
      'Fernanda Rocha',
      'Lucas Pereira',
      'Camila Dias',
      'Bruno Nunes',
      'Patricia Gomes',
      'Diego Santos',
      'Larissa Martins',
    ];

    for (let i = 0; i < userNames.length; i++) {
      const hashedUserPassword = await bcrypt.hash('user123', 10);
      const user = userRepository.create({
        name: userNames[i],
        email: `user${i + 1}@beewear.com`,
        password: hashedUserPassword,
        role: Role.USER,
      });
      const savedUser = await userRepository.save(user);
      users.push(savedUser);
    }
    console.log(`✅ Criados ${users.length + 1} usuários`);

    // 2. Criar endereços para os usuários
    console.log('🏠 Criando endereços...');
    const cities = [
      'Lisboa',
      'Porto',
      'Braga',
      'Coimbra',
      'Aveiro',
      'Faro',
      'Setúbal',
      'Leiria',
    ];
    const states = [
      'Lisboa',
      'Porto',
      'Braga',
      'Coimbra',
      'Aveiro',
      'Faro',
      'Setúbal',
      'Leiria',
    ];
    const neighborhoods = [
      'Centro',
      'Alto',
      'Baixo',
      'Norte',
      'Sul',
      'Leste',
      'Oeste',
      'Nova',
    ];

    for (const user of users) {
      // Cada usuário terá entre 1-3 endereços
      const addressCount = faker.number.int({ min: 1, max: 3 });
      for (let i = 0; i < addressCount; i++) {
        const address = addressRepository.create({
          name: faker.helpers.arrayElement([
            'Casa',
            'Trabalho',
            'Apartamento',
            'Escritório',
          ]),
          street: faker.location.street(),
          number: faker.location.buildingNumber(),
          complement: faker.helpers.maybe(
            () => faker.location.secondaryAddress(),
            { probability: 0.3 },
          ),
          neighborhood: faker.helpers.arrayElement(neighborhoods),
          city: faker.helpers.arrayElement(cities),
          state: faker.helpers.arrayElement(states),
          postalCode: faker.location.zipCode('####-###'),
          country: 'Portugal',
          userId: user.id,
        });
        await addressRepository.save(address);
      }
    }
    console.log('✅ Endereços criados para todos os usuários');

    // 3. Criar coleções
    console.log('📚 Criando coleções...');
    const collections: Collection[] = [];
    for (const collectionData of expandedCollections) {
      const randomImages = imageSeederService.getRandomImages(1);
      const processedImage = await imageSeederService.processImageForSeeding(
        randomImages[0],
      );
      const collection = collectionRepository.create({
        name: collectionData.name,
        description: collectionData.description,
        active: true,
        imageUrl: processedImage,
      });
      const savedCollection = await collectionRepository.save(collection);
      collections.push(savedCollection);
    }
    console.log(`✅ Criadas ${collections.length} coleções`);

    // 4. Criar produtos e variações
    console.log('👕 Criando produtos...');
    const allProducts: Product[] = [];
    const allVariations: ProductVariation[] = [];

    for (const productData of expandedProducts) {
      const collection = faker.helpers.arrayElement(collections);

      // Criar produto
      const product = productRepository.create({
        name: productData.name,
        active: true,
        collection: { id: collection.id } as Collection,
      });
      const savedProduct = await productRepository.save(product);
      allProducts.push(savedProduct);

      // Criar variações para cada cor
      for (const color of productData.colors) {
        const randomImages = imageSeederService.getRandomImages(
          faker.number.int({ min: 1, max: 4 }),
        );
        const processedImages =
          await imageSeederService.processImagesForSeeding(randomImages);
        const variation = productVariationRepository.create({
          color,
          name: `${productData.name} ${color}`,
          price: productData.price,
          images: processedImages,
          product: { id: savedProduct.id } as Product,
        });
        const savedVariation = await productVariationRepository.save(variation);
        allVariations.push(savedVariation);

        // Criar tamanhos (S, M, L, XL)
        const sizes = [Size.S, Size.M, Size.L, Size.XL];
        for (const size of sizes) {
          const productVariationSize = productVariationSizeRepository.create({
            size,
            productVariation: { id: savedVariation.id } as ProductVariation,
          });
          const savedSize =
            await productVariationSizeRepository.save(productVariationSize);

          // Criar estoque
          const stockItem = stockItemRepository.create({
            quantity: faker.number.int({ min: 5, max: 100 }),
            productVariationSize: { id: savedSize.id } as ProductVariationSize,
          });
          await stockItemRepository.save(stockItem);
        }
      }
    }
    console.log(
      `✅ Criados ${allProducts.length} produtos com variações e estoque`,
    );

    // 5. Criar pedidos
    console.log('🛒 Criando pedidos...');
    const orderStatuses = Object.values(OrderStatus);
    const paymentMethods = ['CREDIT_CARD', 'KLARNA', 'PIX', 'BANK_TRANSFER'];
    const paymentStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

    // Criar entre 50-100 pedidos
    const orderCount = faker.number.int({ min: 50, max: 100 });
    for (let i = 0; i < orderCount; i++) {
      const user = faker.helpers.arrayElement(users);
      const status = faker.helpers.arrayElement(orderStatuses);
      const paymentMethod = faker.helpers.arrayElement(paymentMethods);
      const paymentStatus = faker.helpers.arrayElement(paymentStatuses);

      // Buscar endereços do usuário
      const userAddresses = await addressRepository.find({
        where: { userId: user.id },
      });
      const shippingAddress =
        userAddresses.length > 0
          ? `${faker.helpers.arrayElement(userAddresses).street}, ${faker.helpers.arrayElement(userAddresses).number}, ${faker.helpers.arrayElement(userAddresses).city}`
          : faker.location.streetAddress();

      const order = orderRepository.create({
        user: user,
        status,
        totalAmount: 0, // Será calculado
        shippingCost: faker.number.int({ min: 500, max: 1500 }) / 100,
        shippingAddress,
        paymentMethodType: paymentMethod,
        paymentStatus,
        notes: faker.helpers.maybe(() => faker.lorem.sentence(), {
          probability: 0.3,
        }),
        paymentIntentId: faker.string.uuid(),
      });
      const savedOrder = await orderRepository.save(order);

      // Criar itens do pedido (1-5 itens por pedido)
      const itemCount = faker.number.int({ min: 1, max: 5 });
      let orderTotal = 0;

      for (let j = 0; j < itemCount; j++) {
        const variation = faker.helpers.arrayElement(allVariations);
        const quantity = faker.number.int({ min: 1, max: 3 });
        const unitPrice = variation.price;
        const totalPrice = unitPrice * quantity;
        orderTotal += totalPrice;

        const orderItem = orderItemRepository.create({
          order: { id: savedOrder.id } as Order,
          productName: variation.product?.name || 'Produto',
          variationName: variation.name,
          color: variation.color,
          size: faker.helpers.arrayElement(['S', 'M', 'L', 'XL']),
          image: faker.helpers.arrayElement(variation.images || []) || null,
          quantity,
          unitPrice,
          totalPrice,
          productVariationSizePublicId: faker.string.uuid(),
        });
        await orderItemRepository.save(orderItem);
      }

      // Atualizar total do pedido
      const shippingCost =
        typeof savedOrder.shippingCost === 'number'
          ? savedOrder.shippingCost
          : parseFloat(String(savedOrder.shippingCost));
      savedOrder.totalAmount = parseFloat(
        (orderTotal + shippingCost).toFixed(2),
      );
      await orderRepository.save(savedOrder);
    }
    console.log(`✅ Criados ${orderCount} pedidos com itens`);

    console.log('🎉 Seeding do banco de dados concluído!');
    console.log('📊 Dados criados:');
    console.log(
      `   - ${users.length + 1} usuários (1 admin + ${users.length} comuns)`,
    );
    console.log('   - admin@beewear.com / admin123 (ADMIN)');
    console.log(
      `   - user1@beewear.com até user${users.length}@beewear.com / user123 (USER)`,
    );
    console.log('   - Múltiplos endereços por usuário');
    console.log(`   - ${collections.length} coleções`);
    console.log(`   - ${allProducts.length} produtos`);
    console.log('   - Variações de cores e tamanhos (S, M, L, XL)');
    console.log('   - Estoque para todos os produtos');
    console.log(`   - ${orderCount} pedidos com itens`);
    console.log('   - Diferentes status de pedido e pagamento');
  } catch (error) {
    console.error('❌ Erro durante o seeding:', error);
  } finally {
    await dataSource.destroy();
    console.log('🔌 Conexão encerrada');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
