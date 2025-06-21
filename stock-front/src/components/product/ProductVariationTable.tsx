import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Menu,
  Table,
  Text,
  Title,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconPhoto,
  IconPlus,
  IconTags,
  IconTrash,
} from "@tabler/icons-react";
import type { Product } from "src/types/product";

type Props = {
  product: Product;
};

export const ProductVariationsTable = ({ product }: Props) => {
  const getStatusColor = (stock: number): string => {
    if (stock === 0) return "red";
    if (stock < 10) return "yellow";
    return "green";
  };

  const getStatusLabel = (stock: number): string => {
    if (stock === 0) return "Sem Estoque";
    if (stock < 10) return "Estoque Baixo";
    return "Normal";
  };

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

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Imagens</Table.Th>
            <Table.Th>SKU</Table.Th>
            <Table.Th>Tamanho</Table.Th>
            <Table.Th>Cor</Table.Th>
            <Table.Th>Preço</Table.Th>
            <Table.Th>Estoque</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {product.variations.map((variation) => (
            <Table.Tr key={variation.publicId}>
              <Table.Td>
                <Group gap="xs">
                  <IconEye size={14} />
                  {/* <ImageCarousel images={variation.images} size={60} /> */}
                  {/* {variation.images.length > 0 && (
                    <Tooltip label="Ver todas as imagens">
                      <ActionIcon
                        size="sm"
                        variant="light"
                        onClick={() =>
                          handleViewGallery(
                            variation.images,
                            `${variation.color} ${variation.size} - ${variation.sku}`
                          )
                        }
                      >
                        <IconEye size={14} />
                      </ActionIcon>
                    </Tooltip>
                  )} */}
                </Group>
              </Table.Td>
              <Table.Td>
                <Text fw={500} size="sm">
                  SKU
                </Text>
              </Table.Td>
              <Table.Td>
                <Badge variant="outline" size="sm">
                  {variation.size}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Badge color={variation.color} size="sm" />
              </Table.Td>
              <Table.Td>R$ {variation.price.toFixed(2)}</Table.Td>
              <Table.Td>
                <Text fw={500}>{variation.stock}</Text>
                <Text size="xs" c="dimmed">
                  min: 5
                </Text>
              </Table.Td>
              <Table.Td>
                <Badge color={getStatusColor(variation.stock)} size="sm">
                  {getStatusLabel(variation.stock)}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Menu position="bottom-end" withArrow>
                  <Menu.Target>
                    <ActionIcon variant="subtle" size="sm">
                      <IconDotsVertical size={14} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconEdit size={12} />}
                      // onClick={() => handleEditVariation(variation)}
                    >
                      Editar Variação
                    </Menu.Item>
                    <Menu.Item leftSection={<IconPhoto size={12} />}>
                      Gerenciar Imagens
                    </Menu.Item>
                    <Menu.Item leftSection={<IconTags size={12} />}>
                      Ajustar Estoque
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      leftSection={<IconTrash size={12} />}
                      color="red"
                      // onClick={() => handleRemoveVariation(variation.id)}
                    >
                      Excluir Variação
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
};
