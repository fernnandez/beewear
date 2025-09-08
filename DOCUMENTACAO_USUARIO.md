# Documentação de Usuário - BeeWear

## Visão Geral

O BeeWear é uma aplicação completa de e-commerce para roupas fitness premium, composta por dois sistemas principais:

- **Stock Front**: Painel administrativo para gestão de estoque, produtos e pedidos
- **Store Front**: Loja online para clientes finais

---

## 📊 Stock Front - Painel Administrativo

O Stock Front é o sistema de gestão administrativa da BeeWear, destinado a administradores e funcionários da empresa para gerenciar produtos, estoque, pedidos e relatórios.

### 🔐 Autenticação

#### Login
- **Funcionalidade**: Sistema de autenticação para acesso ao painel administrativo
- **Descrição**: Permite que usuários autorizados façam login com suas credenciais para acessar as funcionalidades administrativas
- **Localização**: `/login`

#### Registro
- **Funcionalidade**: Cadastro de novos usuários administrativos
- **Descrição**: Permite criar novas contas de usuário para acesso ao sistema administrativo
- **Localização**: `/register`

### 📈 Relatórios e Dashboard

#### Página de Relatórios
- **Funcionalidade**: Dashboard principal com métricas e análises do negócio
- **Descrição**: 
  - Visualização de métricas gerais (total de produtos, valor total do estoque)
  - Alertas de estoque baixo e produtos sem estoque
  - Movimentos recentes de estoque
  - Ações rápidas para funcionalidades principais
- **Localização**: `/reports` (página inicial)

### 🛍️ Gestão de Produtos

#### Lista de Produtos
- **Funcionalidade**: Visualização e gestão de todos os produtos cadastrados
- **Descrição**: 
  - Lista paginada de produtos com filtros e busca
  - Visualização de informações básicas (nome, preço, estoque)
  - Ações para editar e gerenciar produtos
- **Localização**: `/products`

#### Cadastro de Produto
- **Funcionalidade**: Criação de novos produtos
- **Descrição**: 
  - Formulário completo para cadastro de produtos
  - Upload de imagens
  - Definição de preços, descrições e variações
  - Configuração de estoque inicial
- **Localização**: `/products/new`

#### Detalhes do Produto
- **Funcionalidade**: Visualização detalhada e edição de produtos específicos
- **Descrição**: 
  - Informações completas do produto
  - Histórico de movimentações de estoque
  - Edição de dados do produto
  - Gestão de variações (tamanhos, cores)
- **Localização**: `/products/:publicId`

### 📦 Gestão de Coleções

#### Lista de Coleções
- **Funcionalidade**: Visualização e gestão de coleções de produtos
- **Descrição**: 
  - Lista de todas as coleções cadastradas
  - Organização de produtos por categorias/temas
  - Ações para editar e gerenciar coleções
- **Localização**: `/collections`

#### Cadastro de Coleção
- **Funcionalidade**: Criação de novas coleções
- **Descrição**: 
  - Formulário para criar coleções temáticas
  - Associação de produtos à coleção
  - Definição de período de validade e promoções
- **Localização**: `/collections/new`

#### Detalhes da Coleção
- **Funcionalidade**: Visualização detalhada e edição de coleções específicas
- **Descrição**: 
  - Informações completas da coleção
  - Lista de produtos associados
  - Métricas de performance da coleção
  - Edição de dados da coleção
- **Localização**: `/collections/:publicId`

### 🛒 Gestão de Pedidos

#### Lista de Pedidos
- **Funcionalidade**: Visualização e gestão de todos os pedidos
- **Descrição**: 
  - Lista paginada de pedidos com filtros
  - Status dos pedidos (pendente, confirmado, enviado, entregue)
  - Informações básicas (cliente, valor, data)
  - Ações para atualizar status dos pedidos
- **Localização**: `/orders`

#### Detalhes do Pedido
- **Funcionalidade**: Visualização detalhada de pedidos específicos
- **Descrição**: 
  - Informações completas do pedido
  - Dados do cliente e endereço de entrega
  - Lista de produtos e quantidades
  - Histórico de atualizações de status
  - Ações para processar o pedido
- **Localização**: `/orders/:publicId`

---

## 🛒 Store Front - Loja Online

O Store Front é a loja online da BeeWear, destinada aos clientes finais para navegação, compra de produtos e gestão de suas contas.

### 🏠 Página Inicial

#### Home
- **Funcionalidade**: Página principal da loja online
- **Descrição**: 
  - Apresentação da marca e produtos principais
  - Galeria de produtos em destaque
  - Seção de características da marca (qualidade, entrega)
  - Navegação intuitiva para produtos
- **Localização**: `/`

### 🛍️ Produtos

#### Página de Produto
- **Funcionalidade**: Visualização detalhada de produtos individuais
- **Descrição**: 
  - Galeria de imagens do produto
  - Informações detalhadas (preço, descrição, materiais)
  - Seleção de variações (tamanho, cor)
  - Botão de adicionar ao carrinho
  - Avaliações e comentários (se disponível)
- **Localização**: `/product/:publicId`

### 🔐 Área do Cliente

#### Minha Conta
- **Funcionalidade**: Dashboard do cliente com informações pessoais
- **Descrição**: 
  - Informações do perfil do usuário
  - Ações rápidas (endereços, pedidos, segurança)
  - Navegação para funcionalidades da conta
- **Localização**: `/account`

#### Endereços
- **Funcionalidade**: Gestão de endereços de entrega
- **Descrição**: 
  - Lista de endereços cadastrados
  - Adicionar novos endereços
  - Editar endereços existentes
  - Definir endereço padrão
- **Localização**: `/account/addresses`

#### Histórico de Pedidos
- **Funcionalidade**: Visualização de todos os pedidos do cliente
- **Descrição**: 
  - Lista de pedidos realizados
  - Status de cada pedido
  - Informações de rastreamento
  - Valor e data dos pedidos
- **Localização**: `/account/orders`

#### Detalhes do Pedido
- **Funcionalidade**: Visualização detalhada de pedidos específicos
- **Descrição**: 
  - Informações completas do pedido
  - Lista de produtos comprados
  - Status atual e histórico de atualizações
  - Informações de entrega e rastreamento
- **Localização**: `/account/orders/:orderId`

### 🛒 Processo de Compra

#### Checkout
- **Funcionalidade**: Processo de finalização da compra
- **Descrição**: 
  - Revisão dos produtos no carrinho
  - Seleção de endereço de entrega
  - Cálculo de frete
  - Seleção de método de pagamento
  - Finalização do pedido
- **Localização**: `/checkout`

#### Confirmação de Pedido
- **Funcionalidade**: Página de confirmação após finalização da compra
- **Descrição**: 
  - Confirmação do pedido realizado
  - Número do pedido para acompanhamento
  - Resumo da compra
  - Próximos passos (rastreamento)
- **Localização**: `/checkout/success`

### 🛒 Carrinho de Compras

#### Funcionalidades do Carrinho
- **Descrição**: 
  - Adicionar produtos ao carrinho
  - Alterar quantidades
  - Remover produtos
  - Visualizar total da compra
  - Acesso rápido ao checkout

---

## 🎨 Características Gerais

### Design e Interface
- **Tema**: Interface moderna e responsiva
- **Cores**: Esquema de cores amarelo como cor primária
- **Modo**: Stock Front usa tema escuro, Store Front usa tema claro
- **Responsividade**: Adaptável a diferentes tamanhos de tela

### Tecnologias
- **Frontend**: React com TypeScript
- **UI Library**: Mantine
- **Roteamento**: React Router
- **Estado**: Context API e React Query
- **Notificações**: Sistema de notificações integrado

### Segurança
- **Autenticação**: Sistema de login protegido
- **Rotas Protegidas**: Acesso restrito a usuários autenticados
- **Validação**: Validação de dados em formulários

---

## 📱 Responsividade

Ambos os sistemas são totalmente responsivos e funcionam em:
- 💻 Desktop
- 📱 Tablets
- 📱 Smartphones

---

## 🔄 Fluxos Principais

### Fluxo Administrativo (Stock Front)
1. Login no sistema administrativo
2. Visualização do dashboard com relatórios
3. Gestão de produtos e coleções
4. Processamento de pedidos
5. Acompanhamento de métricas

### Fluxo do Cliente (Store Front)
1. Navegação na loja online
2. Visualização de produtos
3. Adição ao carrinho
4. Processo de checkout
5. Acompanhamento de pedidos na área do cliente

---

*Esta documentação será atualizada conforme novas funcionalidades forem adicionadas ao sistema.*
