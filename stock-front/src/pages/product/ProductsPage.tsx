import { ProductTable } from "@components/product/ProductTable/ProductTable";
import {
  Button,
  Card,
  Container,
  Flex,
  Group,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { fetchProducts } from "@services/product.service";
import {
  IconFilter,
  IconPackage,
  IconPlus,
  IconSearch,
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
    <>
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

          <ProductTable products={filteredProducts} />
        </Card>
      </Container>
    </>
  );
}
