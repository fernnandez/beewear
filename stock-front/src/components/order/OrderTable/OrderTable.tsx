import { Table } from "@mantine/core";
import { Order } from "../../../types/order";
import { OrderLine } from "./OrderLine";

export const OrderTable = ({ orders }: { orders: Order[] }) => {
  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Cliente</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Status Pagamento</Table.Th>
          <Table.Th>Método</Table.Th>
          <Table.Th>Valor</Table.Th>
          <Table.Th>Itens</Table.Th>
          <Table.Th>Data</Table.Th>
          <Table.Th>Ações</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {orders.map((order) => {
          return <OrderLine key={order.publicId} order={order} />;
        })}
      </Table.Tbody>
    </Table>
  );
};
