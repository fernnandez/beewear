<p align="center">
  <img src=".github/assets/capa.png" alt="Beewear Banner" />
</p>

<h1 align="center">
  <img src=".github/assets/icone.png" alt="BeeWear Icon" width="32" style="vertical-align: middle; margin-right: 8px;" />
  Beewear – Loja de Roupas Fitness
</h1>

<p align="center">
  Plataforma moderna para gestão e venda de roupas fitness.<br />
</p>

---

## 📁 Repositórios

| Projeto          | Descrição                                      |
|------------------|------------------------------------------------|
| [`beewear-api`](#-api-backend---nestjs)      | Backend da aplicação, com NestJS, TypeORM e JWT |
| [`beewear-admin`](#-frontend-admin---react--mantine) | Painel de gestão para produtos, estoque e vendas |

---

## 📦 API Backend – NestJS

### Tecnologias

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT Authentication](https://jwt.io/)
- [Multer](https://github.com/expressjs/multer) para upload de imagens
- Swagger para documentação de rotas
- Testes com Jest e Supertest

### Funcionalidades

- ✅ Cadastro de produtos e variações  
- ✅ Upload de imagens com suporte a S3 no futuro  
- ✅ Gestão de estoque  
- ✅ Gestão de coleções  
- 🔐 Autenticação com JWT  
- 📄 Documentação automática com Swagger

---

## 🧑‍💻 Frontend Admin – React + Mantine

### Tecnologias

- [React](https://reactjs.org/)
- [Mantine](https://mantine.dev/)
- [React Query](https://tanstack.com/query)
- [Axios](https://axios-http.com/) com suporte a JWT
- [Vite](https://vitejs.dev/) como bundler

### Funcionalidades

- 🧾 Cadastro e edição de produtos e variações
- 🖼️ Upload de imagens via painel
- 📦 Controle e visualização de estoque
- 🗂️ Gestão de coleções
- 🔐 Login com token persistido