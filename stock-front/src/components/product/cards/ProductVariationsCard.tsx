import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Menu,
  Paper,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconPhoto,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

interface SizeOption {
  stock: { publicId: string; quantity: number };
  size: string;
}

interface Variation {
  publicId: string;
  color: string;
  price: number;
  sizes: SizeOption[];
  images?: string[] | null;
}

interface ProductVariationsCardProps {
  variations: Variation[];
  getColorName: (color: string) => string;
  onEditImages: (variation: Variation) => void;
  onRemoveImage: (variationId: string, imageIndex: number) => void;
  onAddVariation: () => void;
}

export function ProductVariationsCard({
  variations,
  getColorName,
  onEditImages,
  onAddVariation,
}: ProductVariationsCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl">
      <Card.Section withBorder inheritPadding py="xs" mb="md">
        <Group justify="space-between">
          <div>
            <Title order={4}>Variações do Produto</Title>
            <Text size="sm" c="dimmed">
              Diferentes cores e tamanhos disponíveis
            </Text>
          </div>
          <Button
            size="sm"
            leftSection={<IconPlus size={14} />}
            onClick={onAddVariation}
          >
            Nova Variação
          </Button>
        </Group>
      </Card.Section>

      {variations.length > 0 ? (
        <Stack gap="md">
          {variations.map((variation) => (
            <Card key={variation.publicId} withBorder>
              <Group justify="space-between" mb="md" align="center">
                <Group>
                  <Box
                    w={32}
                    h={32}
                    style={{
                      backgroundColor: variation.color,
                      borderRadius: "50%",
                      border: "2px solid var(--mantine-color-gray-3)",
                    }}
                  />
                  <div>
                    <Text fw={500}>{getColorName(variation.color)}</Text>
                    <Text size="sm" c="dimmed">
                      R$ {variation.price.toFixed(2).replace(".", ",")} •{" "}
                      {variation.sizes.length} tamanhos •{" "}
                      {variation.images?.length || 0} imagens
                    </Text>
                  </div>
                </Group>

                <Group>
                  <Button
                    size="xs"
                    variant="light"
                    leftSection={<IconPhoto size={12} />}
                    onClick={() => onEditImages(variation)}
                  >
                    Imagens
                  </Button>
                  <Menu position="bottom-end" withArrow>
                    <Menu.Target>
                      <ActionIcon variant="subtle" size="sm">
                        <IconDotsVertical size={14} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item leftSection={<IconEdit size={12} />}>
                        Editar Variação
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconPhoto size={12} />}
                        onClick={() => onEditImages(variation)}
                      >
                        Gerenciar Imagens
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        leftSection={<IconTrash size={12} />}
                        color="red"
                      >
                        Excluir Variação
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Group>

              {/* Tabela de Tamanhos e Estoque */}
              <Table highlightOnHover verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Tamanho</Table.Th>
                    <Table.Th>Estoque</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Ações</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {variation.sizes.map((sizeOption) => (
                    <Table.Tr key={sizeOption.stock.publicId}>
                      <Table.Td>
                        <Badge variant="light" color="gray" size="sm">
                          {sizeOption.size}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={500}>{sizeOption.stock.quantity}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={
                            sizeOption.stock.quantity > 0 ? "green" : "red"
                          }
                          variant="light"
                          size="sm"
                        >
                          {sizeOption.stock.quantity > 0
                            ? "Disponível"
                            : "Sem Estoque"}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <ActionIcon
                          variant="light"
                          color="blue"
                          size="sm"
                          radius="xl"
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>
          ))}
        </Stack>
      ) : (
        <Paper p="xl" withBorder>
          <Group align="center" gap="md">
            <Text c="dimmed" size="lg">
              Nenhuma variação cadastrada
            </Text>
            <Button variant="light" leftSection={<IconPlus size={16} />}>
              Adicionar Primeira Variação
            </Button>
          </Group>
        </Paper>
      )}
    </Card>
  );
}
