import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Flex,
  Group,
  Menu,
  Paper,
  Table,
  Text,
  Title,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconPackage,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import type { Product } from "src/types/product";

type Props = {
  products: Product[];
};

export function CollectionProductsTable({ products }: Props) {
  return (
    <Card withBorder padding="lg" radius="md">
      <Card.Section withBorder inheritPadding py="xs" mb="md">
        <Group justify="space-between">
          <div>
            <Title order={4}>Produtos da Coleção</Title>
            <Text size="sm" c="dimmed">
              Produtos associados
            </Text>
          </div>
          <Button size="sm" leftSection={<IconPlus size={14} />} disabled>
            Associar Produto
          </Button>
        </Group>
      </Card.Section>

      {products.length > 0 ? (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ verticalAlign: "middle" }}>Produto</Table.Th>
              <Table.Th style={{ verticalAlign: "middle" }}>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {products.map((product) => (
              <Table.Tr key={product.publicId}>
                <Table.Td style={{ verticalAlign: "middle" }}>
                  <Group wrap="nowrap">
                    <Avatar color="blue" radius="sm" size="sm">
                      {product.name.charAt(0)}
                    </Avatar>
                    <Text fw={500}>{product.name}</Text>
                  </Group>
                </Table.Td>
                <Table.Td style={{ verticalAlign: "middle" }}>
                  <Menu position="bottom-end" withArrow>
                    <Menu.Target>
                      <ActionIcon variant="light" size="md" color="gray">
                        <IconDotsVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconEdit size={12} />}
                        component={Link}
                        to={`/products/${product.publicId}`}
                      >
                        Visualizar Produto
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconX size={12} />}
                        color="orange"
                        disabled
                      >
                        Remover da Coleção
                      </Menu.Item>
                      <Menu.Divider />
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <Paper p="xl" withBorder>
          <Flex direction="column" align="center" gap="md">
            <IconPackage size={48} color="var(--mantine-color-gray-5)" />
            <Text c="dimmed">Nenhum produto encontrado</Text>
          </Flex>
        </Paper>
      )}
    </Card>
  );
}
