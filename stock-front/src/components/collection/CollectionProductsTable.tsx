import {
  ActionIcon,
  Avatar,
  Badge,
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
  IconTrash,
  IconX,
} from "@tabler/icons-react";
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
              <Table.Th>Produto</Table.Th>
              <Table.Th>Cor</Table.Th>
              <Table.Th>Tamanho</Table.Th>
              <Table.Th>Preço</Table.Th>
              <Table.Th>Estoque</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {products.flatMap((product) =>
              product.variations.map((variation) => (
                <Table.Tr key={variation.publicId}>
                  <Table.Td>
                    <Group>
                      <Avatar color="blue" radius="sm" size="sm">
                        {product.name.charAt(0)}
                      </Avatar>
                      <Text fw={500}>{product.name}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={variation.color} size="sm" />
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="ligth" size="sm">
                      {variation.size}
                    </Badge>
                  </Table.Td>
                  <Table.Td>R$ {variation.price.toFixed(2)}</Table.Td>
                  <Table.Td>
                    <Text fw={500}>{variation.stock}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Menu position="bottom-end" withArrow>
                      <Menu.Target>
                        <ActionIcon variant="subtle" size="sm">
                          <IconDotsVertical size={14} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<IconEdit size={12} />}>
                          Editar Produto
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconX size={12} />}
                          color="orange"
                        >
                          Remover da Coleção
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                          leftSection={<IconTrash size={12} />}
                          color="red"
                        >
                          Excluir Produto
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
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
