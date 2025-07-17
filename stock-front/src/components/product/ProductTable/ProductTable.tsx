import { Product } from "@localTypes/product";
import { Table } from "@mantine/core";
import { ProductLine } from "./ProductLine";

export const ProductTable = ({ products }: { products: Product[] }) => {
  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Produto</Table.Th>
          <Table.Th>Coleção</Table.Th>
          <Table.Th>Variações</Table.Th>
          <Table.Th>Preço</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Ações</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {products.map((product) => {
          return <ProductLine key={product.publicId} product={product} />;
        })}
      </Table.Tbody>
    </Table>
  );
};
