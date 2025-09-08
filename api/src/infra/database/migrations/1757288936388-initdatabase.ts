import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initdatabase1757288936388 implements MigrationInterface {
  name = 'Initdatabase1757288936388';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "address" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "street" character varying NOT NULL, "number" character varying NOT NULL, "complement" character varying, "neighborhood" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "postalCode" character varying NOT NULL, "country" character varying NOT NULL DEFAULT 'Portugal', "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "collection" ("id" SERIAL NOT NULL, "public_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "active" boolean NOT NULL DEFAULT false, "description" character varying, "imageUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_926e7bdc3f52cd582078a379f1b" UNIQUE ("name"), CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "stock_movement" ("id" SERIAL NOT NULL, "public_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "quantity" integer NOT NULL, "previousQuantity" integer NOT NULL, "newQuantity" integer NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "stockItemId" integer, CONSTRAINT "PK_9fe1232f916686ae8cf00294749" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "stock_item" ("id" SERIAL NOT NULL, "public_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_0b51047279d22d97442d46dfee8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_variation_size" ("id" SERIAL NOT NULL, "public_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "size" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "productVariationId" integer, "stockId" integer, CONSTRAINT "REL_1ca31c041bcff34a0208a5122d" UNIQUE ("stockId"), CONSTRAINT "PK_254f43cc441e4403d2187c1b130" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_variation" ("id" SERIAL NOT NULL, "public_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "color" character varying NOT NULL, "name" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "images" text array, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "productId" integer, CONSTRAINT "PK_bfae10232dcbc2c77fb37d0ebf5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" SERIAL NOT NULL, "public_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "active" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "collectionId" integer, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_item" ("id" SERIAL NOT NULL, "productName" character varying NOT NULL, "variationName" character varying NOT NULL, "color" character varying NOT NULL, "size" character varying NOT NULL, "image" character varying, "quantity" integer NOT NULL, "unitPrice" numeric(10,2) NOT NULL, "totalPrice" numeric(10,2) NOT NULL, "productVariationSizePublicId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "orderId" integer, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_enum" AS ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" SERIAL NOT NULL, "public_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "paymentIntentId" character varying, "status" "public"."order_status_enum" NOT NULL DEFAULT 'PENDING', "totalAmount" numeric(10,2) NOT NULL, "shippingCost" numeric(10,2) NOT NULL DEFAULT '0', "shippingAddress" character varying, "paymentMethodType" character varying, "paymentStatus" character varying, "notes" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ADD CONSTRAINT "FK_d25f1ea79e282cc8a42bd616aa3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock_movement" ADD CONSTRAINT "FK_7a78658cd8325aaa00571368507" FOREIGN KEY ("stockItemId") REFERENCES "stock_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variation_size" ADD CONSTRAINT "FK_dbf135bb7bf882cda4f9e31f605" FOREIGN KEY ("productVariationId") REFERENCES "product_variation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variation_size" ADD CONSTRAINT "FK_1ca31c041bcff34a0208a5122d7" FOREIGN KEY ("stockId") REFERENCES "stock_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variation" ADD CONSTRAINT "FK_9eb6ebb27c4efb410d7a89670b5" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_a39d98111ddda0b737e683ff847" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_a39d98111ddda0b737e683ff847"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variation" DROP CONSTRAINT "FK_9eb6ebb27c4efb410d7a89670b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variation_size" DROP CONSTRAINT "FK_1ca31c041bcff34a0208a5122d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variation_size" DROP CONSTRAINT "FK_dbf135bb7bf882cda4f9e31f605"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock_movement" DROP CONSTRAINT "FK_7a78658cd8325aaa00571368507"`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" DROP CONSTRAINT "FK_d25f1ea79e282cc8a42bd616aa3"`,
    );
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
    await queryRunner.query(`DROP TABLE "order_item"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "product_variation"`);
    await queryRunner.query(`DROP TABLE "product_variation_size"`);
    await queryRunner.query(`DROP TABLE "stock_item"`);
    await queryRunner.query(`DROP TABLE "stock_movement"`);
    await queryRunner.query(`DROP TABLE "collection"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`DROP TABLE "address"`);
  }
}
