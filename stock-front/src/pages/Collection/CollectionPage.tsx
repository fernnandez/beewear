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
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconPhoto,
  IconPlus,
  IconSearch,
  IconSection,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// Dados simulados de coleções
const mockCollections = [
  {
    id: 1,
    name: "Verão 2024",
    description: "Coleção de roupas leves e coloridas para o verão",
    image: null,
    productsCount: 15,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Inverno Elegante",
    description: "Peças sofisticadas para o inverno com foco em elegância",
    image: null,
    productsCount: 8,
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    name: "Casual Urbano",
    description: "Roupas casuais para o dia a dia na cidade",
    image: null,
    productsCount: 22,
    createdAt: "2024-01-05",
  },
  {
    id: 4,
    name: "Festa & Eventos",
    description: "Vestidos e trajes especiais para ocasiões especiais",
    image: null,
    productsCount: 12,
    createdAt: "2023-12-20",
  },
  {
    id: 5,
    name: "Esportivo",
    description: "Linha fitness e esportiva para atividades físicas",
    image: null,
    productsCount: 18,
    createdAt: "2023-12-15",
  },
];

export default function CollectionsPage() {
  const [collections] = useState(mockCollections);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCollections = collections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppShellLayout>
      <Container size="xl">
        <Group justify="space-between" mb="xl">
          <div>
            <Title order={2}>Coleções</Title>
            <Text c="dimmed">Gerencie suas coleções de produtos</Text>
          </div>
          <Button
            component={Link}
            to="/collections/new"
            leftSection={<IconPlus size={16} />}
          >
            Nova Coleção
          </Button>
        </Group>

        <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
          <Card.Section withBorder inheritPadding py="xs" mb="md">
            <Group>
              <IconSearch size={18} />
              <Title order={4}>Buscar Coleções</Title>
            </Group>
          </Card.Section>

          <TextInput
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftSection={<IconSearch size={16} />}
            style={{ maxWidth: "400px" }}
          />
        </Card>

        {/* Grid de Coleções */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="md">
            <Group>
              <IconSection size={18} />
              <Title order={4}>
                Suas Coleções ({filteredCollections.length})
              </Title>
            </Group>
          </Card.Section>

          {filteredCollections.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
              {filteredCollections.map((collection) => (
                <Card
                  key={collection.id}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                >
                  <Card.Section>
                    <Flex
                      h={120}
                      bg="var(--mantine-color-gray-1)"
                      align="center"
                      justify="center"
                      direction="column"
                      gap="xs"
                    >
                      <Avatar size="xl" color="blue" variant="light">
                        {collection.image ? (
                          <img
                            src={collection.image || "/placeholder.svg"}
                            alt={collection.name}
                          />
                        ) : (
                          getInitials(collection.name)
                        )}
                      </Avatar>
                      <Badge variant="light" color="gray" size="xs">
                        <IconPhoto size={12} style={{ marginRight: 4 }} />
                        Imagem em breve
                      </Badge>
                    </Flex>
                  </Card.Section>

                  <Group justify="space-between" mt="md" mb="xs">
                    <Title order={5}>{collection.name}</Title>
                    <Menu position="bottom-end" withArrow>
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                          <IconDotsVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<IconEdit size={14} />}>
                          Editar
                        </Menu.Item>
                        <Menu.Item leftSection={<IconSection size={14} />}>
                          Ver Produtos
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                          leftSection={<IconTrash size={14} />}
                          color="red"
                        >
                          Excluir
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>

                  <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                    {collection.description}
                  </Text>

                  <Group justify="space-between">
                    <div>
                      <Text size="sm" fw={500}>
                        {collection.productsCount} produtos
                      </Text>
                      <Text size="xs" c="dimmed">
                        Criada em {formatDate(collection.createdAt)}
                      </Text>
                    </div>
                    <Badge variant="light" color="blue">
                      Ativa
                    </Badge>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <Paper p="xl" withBorder>
              <Flex direction="column" align="center" gap="md">
                <IconSection size={48} color="var(--mantine-color-gray-5)" />
                <Text c="dimmed">Nenhuma coleção encontrada</Text>
                {searchTerm && (
                  <Button variant="light" onClick={() => setSearchTerm("")}>
                    Limpar busca
                  </Button>
                )}
              </Flex>
            </Paper>
          )}
        </Card>

        {/* Estatísticas */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} mt="xl">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack align="center">
              <Title order={2} c="blue">
                {collections.length}
              </Title>
              <Text size="sm" c="dimmed" ta="center">
                Total de Coleções
              </Text>
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack align="center">
              <Title order={2} c="green">
                {collections.reduce((sum, col) => sum + col.productsCount, 0)}
              </Title>
              <Text size="sm" c="dimmed" ta="center">
                Produtos em Coleções
              </Text>
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack align="center">
              <Title order={2} c="orange">
                {Math.round(
                  collections.reduce((sum, col) => sum + col.productsCount, 0) /
                    collections.length
                )}
              </Title>
              <Text size="sm" c="dimmed" ta="center">
                Média por Coleção
              </Text>
            </Stack>
          </Card>
        </SimpleGrid>
      </Container>
    </AppShellLayout>
  );
}
