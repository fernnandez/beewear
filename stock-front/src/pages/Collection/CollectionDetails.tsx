"use client";

import { AppShellLayout } from "@components/AppShell";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Menu,
  Paper,
  SimpleGrid,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconCalendar,
  IconDeviceFloppy,
  IconDotsVertical,
  IconEdit,
  IconFolder,
  IconPackage,
  IconPhoto,
  IconPlus,
  IconShoppingCart,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { formatDate } from "@utils/formatDate";
import { getInitials } from "@utils/getInitials";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Dados simulados da coleção
const mockCollection = {
  id: "1",
  name: "Verão 2024",
  description:
    "Coleção de roupas leves e coloridas para o verão, focada em tecidos naturais e cores vibrantes que remetem à estação mais quente do ano.",
  image: null,
  productsCount: 15,
  createdAt: "2024-01-15",
  updatedAt: "2024-01-20",
  isActive: true,
};

// Produtos da coleção (simulados)
const mockProducts = [
  {
    id: "1",
    name: "Camiseta Tropical",
    category: "Camisetas",
    price: 39.9,
    stock: 25,
    image: null,
  },
  {
    id: "2",
    name: "Shorts Linho",
    category: "Shorts",
    price: 59.9,
    stock: 18,
    image: null,
  },
  {
    id: "3",
    name: "Vestido Floral Verão",
    category: "Vestidos",
    price: 89.9,
    stock: 12,
    image: null,
  },
  {
    id: "4",
    name: "Blusa Manga Curta",
    category: "Blusas",
    price: 45.9,
    stock: 30,
    image: null,
  },
];

export default function CollectionDetailPage() {
  const navigate = useNavigate();
  //   const params = useParams();

  const [collection, setCollection] = useState(mockCollection);

  const [products] = useState(mockProducts);

  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    name: collection.name,
    description: collection.description,
    isActive: collection.isActive,
  });

  const handleEdit = () => {
    setEditForm({
      name: collection.name,
      description: collection.description,
      isActive: collection.isActive,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editForm.name.trim()) {
      notifications.show({
        title: "Erro",
        message: "O nome da coleção é obrigatório",
        color: "red",
      });
      return;
    }

    // Simular salvamento
    setCollection({
      ...collection,
      name: editForm.name,
      description: editForm.description,
      isActive: editForm.isActive,
      updatedAt: new Date().toISOString().split("T")[0],
    });

    setIsEditing(false);
    notifications.show({
      title: "Coleção atualizada",
      message: "As informações foram salvas com sucesso",
      color: "green",
    });
  };

  const handleCancel = () => {
    setEditForm({
      name: collection.name,
      description: collection.description,
      isActive: collection.isActive,
    });
    setIsEditing(false);
  };

  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );

  return (
    <AppShellLayout>
      <Container size="xl">
        <Group justify="space-between" mb="xl">
          <div>
            <Group mb="xs">
              <Button variant="subtle" onClick={() => navigate("/collections")}>
                ← Voltar
              </Button>
            </Group>
            <Title order={2}>
              {isEditing ? "Editando Coleção" : "Detalhes da Coleção"}
            </Title>
            <Text c="dimmed">
              {isEditing
                ? "Modifique as informações da coleção"
                : "Visualize e gerencie sua coleção"}
            </Text>
          </div>
          <Group>
            {!isEditing ? (
              <Button
                variant="outline"
                leftSection={<IconEdit size={16} />}
                onClick={handleEdit}
              >
                Editar
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button
                  leftSection={<IconDeviceFloppy size={16} />}
                  onClick={handleSave}
                >
                  Salvar
                </Button>
              </>
            )}
          </Group>
        </Group>

        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg" mb="xl">
          {/* Informações da Coleção */}
          <div style={{ gridColumn: "span 2" }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs" mb="md">
                <Group>
                  <IconFolder size={18} />
                  <Title order={4}>Informações da Coleção</Title>
                  {!isEditing && (
                    <Badge
                      color={collection.isActive ? "green" : "red"}
                      variant="light"
                    >
                      {collection.isActive ? "Ativa" : "Inativa"}
                    </Badge>
                  )}
                </Group>
              </Card.Section>

              {isEditing ? (
                <Stack>
                  <TextInput
                    label="Nome da Coleção"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                  <Textarea
                    label="Descrição"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    minRows={4}
                    required
                  />
                  <Switch
                    label="Coleção ativa"
                    description="Coleções inativas não aparecem nas listagens públicas"
                    checked={editForm.isActive}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        isActive: e.currentTarget.checked,
                      }))
                    }
                  />
                </Stack>
              ) : (
                <Stack>
                  <div>
                    <Text size="sm" fw={500} c="dimmed" mb={4}>
                      Nome
                    </Text>
                    <Title order={3}>{collection.name}</Title>
                  </div>
                  <div>
                    <Text size="sm" fw={500} c="dimmed" mb={4}>
                      Descrição
                    </Text>
                    <Text>{collection.description}</Text>
                  </div>
                  <SimpleGrid cols={2}>
                    <div>
                      <Text size="sm" fw={500} c="dimmed" mb={4}>
                        Criada em
                      </Text>
                      <Group gap="xs">
                        <IconCalendar
                          size={16}
                          color="var(--mantine-color-gray-6)"
                        />
                        <Text size="sm">
                          {formatDate(collection.createdAt)}
                        </Text>
                      </Group>
                    </div>
                    <div>
                      <Text size="sm" fw={500} c="dimmed" mb={4}>
                        Última atualização
                      </Text>
                      <Group gap="xs">
                        <IconEdit
                          size={16}
                          color="var(--mantine-color-gray-6)"
                        />
                        <Text size="sm">
                          {formatDate(collection.updatedAt)}
                        </Text>
                      </Group>
                    </div>
                  </SimpleGrid>
                </Stack>
              )}
            </Card>
          </div>

          <Stack>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500} c="dimmed">
                  Total de Produtos
                </Text>
                <IconPackage size={16} color="var(--mantine-color-blue-6)" />
              </Group>
              <Title order={2} c="blue">
                {products.length}
              </Title>
              <Text size="xs" c="dimmed">
                produtos nesta coleção
              </Text>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500} c="dimmed">
                  Valor Total
                </Text>
                <IconShoppingCart
                  size={16}
                  color="var(--mantine-color-green-6)"
                />
              </Group>
              <Title order={2} c="green">
                R$ {totalValue.toFixed(2)}
              </Title>
              <Text size="xs" c="dimmed">
                valor em estoque
              </Text>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500} c="dimmed">
                  Estoque Total
                </Text>
                <IconPackage size={16} color="var(--mantine-color-orange-6)" />
              </Group>
              <Title order={2} c="orange">
                {products.reduce((sum, p) => sum + p.stock, 0)}
              </Title>
              <Text size="xs" c="dimmed">
                unidades disponíveis
              </Text>
            </Card>
          </Stack>
        </SimpleGrid>

        <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
          <Card.Section withBorder inheritPadding py="xs" mb="md">
            <Group>
              <IconPhoto size={18} />
              <Title order={4}>Imagem da Coleção</Title>
              <Badge color="orange" size="sm">
                Em breve
              </Badge>
            </Group>
          </Card.Section>

          <Paper p="xl" withBorder bg="var(--mantine-color-gray-0)">
            <Flex direction="column" align="center" gap="md">
              <Avatar size="xl" color="blue" variant="light">
                {getInitials(collection.name)}
              </Avatar>
              <Text c="dimmed" ta="center">
                Nenhuma imagem definida
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                A funcionalidade de upload estará disponível em breve
              </Text>
            </Flex>
          </Paper>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="md">
            <Group justify="space-between">
              <div>
                <Title order={4}>Produtos da Coleção</Title>
                <Text size="sm" c="dimmed">
                  Produtos associados a esta coleção
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
                  <Table.Th>Categoria</Table.Th>
                  <Table.Th>Preço</Table.Th>
                  <Table.Th>Estoque</Table.Th>
                  <Table.Th>Ações</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {products.map((product) => (
                  <Table.Tr key={product.id}>
                    <Table.Td>
                      <Group>
                        <Avatar color="blue" radius="sm" size="sm">
                          {product.name.charAt(0)}
                        </Avatar>
                        <Text fw={500}>{product.name}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" size="sm">
                        {product.category}
                      </Badge>
                    </Table.Td>
                    <Table.Td>R$ {product.price.toFixed(2)}</Table.Td>
                    <Table.Td>
                      <Text fw={500}>{product.stock}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Menu position="bottom-end" withArrow disabled>
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
                ))}
              </Table.Tbody>
            </Table>
          ) : (
            <Paper p="xl" withBorder>
              <Flex direction="column" align="center" gap="md">
                <IconPackage size={48} color="var(--mantine-color-gray-5)" />
                <Text c="dimmed">Nenhum produto associado a esta coleção</Text>
                <Button variant="light" leftSection={<IconPlus size={16} />}>
                  Adicionar Primeiro Produto
                </Button>
              </Flex>
            </Paper>
          )}
        </Card>
      </Container>
    </AppShellLayout>
  );
}
