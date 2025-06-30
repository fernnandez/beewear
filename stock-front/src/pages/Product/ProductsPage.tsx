import { AppShellLayout } from "@components/AppShell";
import { ProductVariation } from "@localTypes/product";
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
  Select,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { fetchProducts } from "@services/product.service";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFilter,
  IconPackage,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductsPage() {
  const navigate = useNavigate();
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    "Todas"
  );
  const [selectedStatus, setSelectedStatus] = useState<string | null>("Todos");

  // Função para calcular preço mínimo e máximo das variações
  const getPriceRange = (variations: ProductVariation[]) => {
    if (variations.length === 0) return { min: 0, max: 0 };

    const prices = variations.map((v) => Number.parseFloat(v.price.toString()));
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return { min, max };
  };

  // Função para obter coleções únicas
  const getUniqueCollections = () => {
    const collections = products.map((p) => p.collection);
    const unique = collections.filter(
      (collection, index, self) =>
        index === self.findIndex((c) => c.id === collection.id)
    );
    return unique;
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCollection =
      selectedCollection === "Todas" ||
      product.collection.name === selectedCollection;
    const matchesStatus =
      selectedStatus === "Todos" ||
      (selectedStatus === "Ativo" && product.active) ||
      (selectedStatus === "Inativo" && !product.active);

    return matchesSearch && matchesCollection && matchesStatus;
  });

  return (
    <AppShellLayout>
      <Container size="xl">
        <Group justify="space-between" mb="xl">
          <div>
            <Title order={2}>Produtos</Title>
            <Text c="dimmed">Gerencie seus produtos e variações</Text>
          </div>
          <Button
            onClick={() => navigate("/products/new")}
            leftSection={<IconPlus size={16} />}
          >
            Novo Produto
          </Button>
        </Group>

        <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
          <Card.Section withBorder inheritPadding py="xs" mb="md">
            <Group>
              <IconFilter size={18} />
              <Title order={4}>Filtros</Title>
            </Group>
          </Card.Section>

          <Flex gap="md" wrap="wrap">
            <TextInput
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftSection={<IconSearch size={16} />}
              style={{ flex: 1, minWidth: "200px" }}
            />

            <Select
              placeholder="Coleção"
              data={["Todas", ...getUniqueCollections().map((c) => c.name)]}
              value={selectedCollection}
              onChange={setSelectedCollection}
              style={{ minWidth: "150px" }}
            />

            <Select
              placeholder="Status"
              data={["Todos", "Ativo", "Inativo"]}
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ minWidth: "120px" }}
            />

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedCollection("Todas");
                setSelectedStatus("Todos");
              }}
            >
              Limpar Filtros
            </Button>
          </Flex>
        </Card>

        {/* Lista de Produtos */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="md">
            <Group>
              <IconPackage size={18} />
              <Title order={4}>
                Lista de Produtos ({filteredProducts.length})
              </Title>
            </Group>
          </Card.Section>

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
              {filteredProducts.map((product) => {
                const priceRange = getPriceRange(product.variations);

                return (
                  <Table.Tr key={product.publicId}>
                    <Table.Td>
                      <Group>
                        <Avatar color="blue" radius="sm" size="md">
                          {product.name.charAt(0)}
                        </Avatar>
                        <div>
                          <Text fw={500}>{product.name}</Text>
                          <Text size="sm" c="dimmed">
                            ID: {product.publicId.slice(0, 8)}...
                          </Text>
                        </div>
                      </Group>
                    </Table.Td>

                    <Table.Td>
                      <Badge
                        variant="light"
                        color={product.collection.active ? "blue" : "gray"}
                        size="sm"
                      >
                        {product.collection.name}
                      </Badge>
                    </Table.Td>

                    <Table.Td>
                      <Group gap="xs">
                        <Text fw={500}>{product.variations.length}</Text>
                        <Group gap={4}>
                          {product.variations.slice(0, 3).map((variation) => (
                            <div
                              key={variation.publicId}
                              style={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                backgroundColor: variation.color,
                                border: "1px solid #e0e0e0",
                              }}
                              title={variation.name}
                            />
                          ))}
                          {product.variations.length > 3 && (
                            <div
                              style={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                backgroundColor: "#f5f5f5",
                                border: "1px solid #e0e0e0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text size="xs" c="dimmed">
                                +
                              </Text>
                            </div>
                          )}
                        </Group>
                      </Group>
                    </Table.Td>

                    <Table.Td>
                      <Text fw={500}>
                        {priceRange.min === priceRange.max
                          ? `R$ ${priceRange.min.toFixed(2)}`
                          : `R$ ${priceRange.min.toFixed(
                              2
                            )} - R$ ${priceRange.max.toFixed(2)}`}
                      </Text>
                    </Table.Td>

                    <Table.Td>
                      <Badge
                        color={product.active ? "green" : "gray"}
                        size="sm"
                      >
                        {product.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </Table.Td>

                    <Table.Td>
                      <Menu position="bottom-end" withArrow>
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <IconDotsVertical size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconEye size={14} />}
                            onClick={() =>
                              navigate(`/products/${product.publicId}`)
                            }
                          >
                            Ver Detalhes
                          </Menu.Item>
                          <Menu.Item leftSection={<IconEdit size={14} />}>
                            Editar
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
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Card>
      </Container>
    </AppShellLayout>
  );
}
