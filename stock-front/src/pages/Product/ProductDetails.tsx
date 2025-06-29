import { AppShellLayout } from "@components/AppShell";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  CloseButton,
  Container,
  Divider,
  FileInput,
  Flex,
  Group,
  Image,
  Menu,
  Modal,
  NumberInput,
  Paper,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconAlertTriangle,
  IconCalendar,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconDeviceFloppy,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconPackage,
  IconPhoto,
  IconPlus,
  IconShoppingCart,
  IconTags,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Dados simulados do produto
const mockProduct = {
  id: "1",
  name: "Camiseta Básica Premium",
  description:
    "Camiseta básica de alta qualidade, confeccionada em algodão 100% penteado. Ideal para o uso diário, oferece conforto e durabilidade.",
  category: "Camisetas",
  brand: "BasicWear",
  supplier: "Fornecedor ABC",
  basePrice: 29.9,
  isActive: true,
  createdAt: "2024-01-15",
  updatedAt: "2024-01-20",
};

// Variações do produto com múltiplas imagens (simuladas)
const mockVariations = [
  {
    id: "1",
    sku: "CAM-BAS-P-AZ",
    size: "P",
    color: "Azul",
    stock: 15,
    minStock: 5,
    price: 29.9,
    isActive: true,
    status: "normal",
    images: [
      "/placeholder.svg?height=200&width=200&text=Azul+P+Frente",
      "/placeholder.svg?height=200&width=200&text=Azul+P+Costas",
      "/placeholder.svg?height=200&width=200&text=Azul+P+Detalhe",
    ],
  },
  {
    id: "2",
    sku: "CAM-BAS-M-AZ",
    size: "M",
    color: "Azul",
    stock: 25,
    minStock: 10,
    price: 29.9,
    isActive: true,
    status: "normal",
    images: [
      "/placeholder.svg?height=200&width=200&text=Azul+M+Frente",
      "/placeholder.svg?height=200&width=200&text=Azul+M+Costas",
    ],
  },
  {
    id: "3",
    sku: "CAM-BAS-G-AZ",
    size: "G",
    color: "Azul",
    stock: 3,
    minStock: 5,
    price: 29.9,
    isActive: true,
    status: "baixo",
    images: [],
  },
  {
    id: "4",
    sku: "CAM-BAS-P-BR",
    size: "P",
    color: "Branco",
    stock: 0,
    minStock: 5,
    price: 29.9,
    isActive: true,
    status: "sem",
    images: ["/placeholder.svg?height=200&width=200&text=Branco+P+Frente"],
  },
  {
    id: "5",
    sku: "CAM-BAS-M-BR",
    size: "M",
    color: "Branco",
    stock: 18,
    minStock: 8,
    price: 29.9,
    isActive: true,
    status: "normal",
    images: [
      "/placeholder.svg?height=200&width=200&text=Branco+M+Frente",
      "/placeholder.svg?height=200&width=200&text=Branco+M+Costas",
      "/placeholder.svg?height=200&width=200&text=Branco+M+Detalhe",
      "/placeholder.svg?height=200&width=200&text=Branco+M+Tag",
    ],
  },
];

interface ImageCarouselProps {
  images: string[];
  size?: number;
}

function ImageCarousel({ images, size = 60 }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <Paper
        w={size}
        h={size}
        withBorder
        bg="var(--mantine-color-gray-0)"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconPhoto size={size * 0.4} color="var(--mantine-color-gray-5)" />
      </Paper>
    );
  }

  if (images.length === 1) {
    return (
      <Image
        src={images[0] || "/placeholder.svg"}
        alt="Produto"
        radius="sm"
        fit="cover"
        w={size}
        h={size}
      />
    );
  }

  return (
    <Box pos="relative" w={size} h={size}>
      <Image
        src={images[currentIndex] || "/placeholder.svg"}
        alt="Produto"
        radius="sm"
        fit="cover"
        w={size}
        h={size}
      />

      {/* Indicadores */}
      <Group
        gap={2}
        justify="center"
        pos="absolute"
        bottom={2}
        left="50%"
        style={{ transform: "translateX(-50%)" }}
      >
        {images.map((_, index) => (
          <Box
            key={index}
            w={4}
            h={4}
            bg={index === currentIndex ? "white" : "rgba(255,255,255,0.5)"}
            style={{ borderRadius: "50%", cursor: "pointer" }}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </Group>

      {/* Navegação */}
      {images.length > 1 && (
        <>
          <ActionIcon
            size="xs"
            variant="filled"
            color="dark"
            pos="absolute"
            left={2}
            top="50%"
            style={{ transform: "translateY(-50%)" }}
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === 0 ? images.length - 1 : prev - 1
              )
            }
          >
            <IconChevronLeft size={10} />
          </ActionIcon>
          <ActionIcon
            size="xs"
            variant="filled"
            color="dark"
            pos="absolute"
            right={2}
            top="50%"
            style={{ transform: "translateY(-50%)" }}
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === images.length - 1 ? 0 : prev + 1
              )
            }
          >
            <IconChevronRight size={10} />
          </ActionIcon>
        </>
      )}

      {/* Contador */}
      <Badge
        size="xs"
        pos="absolute"
        top={2}
        right={2}
        bg="rgba(0,0,0,0.7)"
        c="white"
        style={{ fontSize: "8px", padding: "2px 4px" }}
      >
        {images.length}
      </Badge>
    </Box>
  );
}

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const productPublicId = params.publicId as string;

  const [product, setProduct] = useState(mockProduct);
  const [variations, setVariations] = useState(mockVariations);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewVariationModal, setShowNewVariationModal] = useState(false);
  const [showEditVariationModal, setShowEditVariationModal] = useState(false);
  const [editingVariation, setEditingVariation] = useState<any>(null);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryTitle, setGalleryTitle] = useState("");

  const [editForm, setEditForm] = useState({
    name: product.name,
    description: product.description,
    category: product.category,
    brand: product.brand,
    supplier: product.supplier,
    basePrice: product.basePrice,
    isActive: product.isActive,
  });

  const [newVariation, setNewVariation] = useState({
    sku: "",
    size: "",
    color: "",
    stock: 0,
    minStock: 5,
    price: product.basePrice,
    images: [] as File[],
  });

  const [variationForm, setVariationForm] = useState({
    sku: "",
    size: "",
    color: "",
    stock: 0,
    minStock: 5,
    price: 0,
    isActive: true,
    images: [] as string[],
    newImages: [] as File[],
  });

  const handleEdit = () => {
    setEditForm({
      name: product.name,
      description: product.description,
      category: product.category,
      brand: product.brand,
      supplier: product.supplier,
      basePrice: product.basePrice,
      isActive: product.isActive,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editForm.name.trim()) {
      notifications.show({
        title: "Erro",
        message: "O nome do produto é obrigatório",
        color: "red",
      });
      return;
    }

    setProduct({
      ...product,
      name: editForm.name,
      description: editForm.description,
      category: editForm.category,
      brand: editForm.brand,
      supplier: editForm.supplier,
      basePrice: editForm.basePrice,
      isActive: editForm.isActive,
      updatedAt: new Date().toISOString().split("T")[0],
    });

    setIsEditing(false);
    notifications.show({
      title: "Produto atualizado",
      message: "As informações foram salvas com sucesso",
      color: "green",
    });
  };

  const handleCancel = () => {
    setEditForm({
      name: product.name,
      description: product.description,
      category: product.category,
      brand: product.brand,
      supplier: product.supplier,
      basePrice: product.basePrice,
      isActive: product.isActive,
    });
    setIsEditing(false);
  };

  const handleAddVariation = () => {
    if (!newVariation.sku || !newVariation.size || !newVariation.color) {
      notifications.show({
        title: "Erro",
        message: "Preencha todos os campos obrigatórios",
        color: "red",
      });
      return;
    }

    const variation = {
      id: String(variations.length + 1),
      sku: newVariation.sku,
      size: newVariation.size,
      color: newVariation.color,
      stock: newVariation.stock,
      minStock: newVariation.minStock,
      price: newVariation.price,
      isActive: true,
      status:
        newVariation.stock <= newVariation.minStock
          ? newVariation.stock === 0
            ? "sem"
            : "baixo"
          : "normal",
      images: newVariation.images.map(
        (_, index) =>
          `/placeholder.svg?height=200&width=200&text=Nova+${index + 1}`
      ),
    };

    setVariations([...variations, variation]);
    setNewVariation({
      sku: "",
      size: "",
      color: "",
      stock: 0,
      minStock: 5,
      price: product.basePrice,
      images: [],
    });
    setShowNewVariationModal(false);

    notifications.show({
      title: "Variação adicionada",
      message: `Nova variação ${newVariation.size} ${newVariation.color} criada com sucesso`,
      color: "green",
    });
  };

  const handleEditVariation = (variation: any) => {
    setEditingVariation(variation);
    setVariationForm({
      sku: variation.sku,
      size: variation.size,
      color: variation.color,
      stock: variation.stock,
      minStock: variation.minStock,
      price: variation.price,
      isActive: variation.isActive,
      images: [...variation.images],
      newImages: [],
    });
    setShowEditVariationModal(true);
  };

  const handleSaveVariation = () => {
    if (!variationForm.sku || !variationForm.size || !variationForm.color) {
      notifications.show({
        title: "Erro",
        message: "Preencha todos os campos obrigatórios",
        color: "red",
      });
      return;
    }

    const updatedVariations = variations.map((v) =>
      v.id === editingVariation.id
        ? {
            ...v,
            sku: variationForm.sku,
            size: variationForm.size,
            color: variationForm.color,
            stock: variationForm.stock,
            minStock: variationForm.minStock,
            price: variationForm.price,
            isActive: variationForm.isActive,
            status:
              variationForm.stock <= variationForm.minStock
                ? variationForm.stock === 0
                  ? "sem"
                  : "baixo"
                : "normal",
            images: [
              ...variationForm.images,
              ...variationForm.newImages.map(
                (_, index) =>
                  `/placeholder.svg?height=200&width=200&text=Nova+${index + 1}`
              ),
            ],
          }
        : v
    );

    setVariations(updatedVariations);
    setShowEditVariationModal(false);
    setEditingVariation(null);

    notifications.show({
      title: "Variação atualizada",
      message: "As informações foram salvas com sucesso",
      color: "green",
    });
  };

  const handleRemoveVariation = (variationId: string) => {
    setVariations(variations.filter((v) => v.id !== variationId));
    notifications.show({
      title: "Variação removida",
      message: "A variação foi excluída com sucesso",
      color: "green",
    });
  };

  const handleRemoveImage = (imageIndex: number) => {
    setVariationForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== imageIndex),
    }));
  };

  const handleViewGallery = (images: string[], title: string) => {
    setGalleryImages(images);
    setGalleryTitle(title);
    setShowImageGallery(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "baixo":
        return "yellow";
      case "sem":
        return "red";
      default:
        return "green";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "baixo":
        return "Estoque Baixo";
      case "sem":
        return "Sem Estoque";
      default:
        return "Normal";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const totalStock = variations.reduce(
    (sum, variation) => sum + variation.stock,
    0
  );
  const totalValue = variations.reduce(
    (sum, variation) => sum + variation.price * variation.stock,
    0
  );
  const lowStockCount = variations.filter((v) => v.status === "baixo").length;
  const outOfStockCount = variations.filter((v) => v.status === "sem").length;
  const totalImages = variations.reduce(
    (sum, variation) => sum + variation.images.length,
    0
  );

  return (
    <AppShellLayout>
      <Container size="xl">
        {/* Cabeçalho */}
        <Group justify="space-between" mb="xl">
          <div>
            <Group mb="xs">
              <Button variant="subtle" onClick={() => navigate("/products")}>
                ← Voltar
              </Button>
            </Group>
            <Title order={2}>
              {isEditing ? "Editando Produto" : "Detalhes do Produto"}
            </Title>
            <Text c="dimmed">
              {isEditing
                ? "Modifique as informações do produto"
                : "Visualize e gerencie seu produto"}
            </Text>
          </div>
          <Group>
            {!isEditing ? (
              <>
                <Button
                  variant="outline"
                  leftSection={<IconEdit size={16} />}
                  onClick={handleEdit}
                >
                  Editar
                </Button>
                <Button
                  leftSection={<IconPlus size={16} />}
                  onClick={() => setShowNewVariationModal(true)}
                >
                  Nova Variação
                </Button>
              </>
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
          {/* Informações do Produto */}
          <div style={{ gridColumn: "span 2" }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs" mb="md">
                <Group>
                  <IconPackage size={18} />
                  <Title order={4}>Informações do Produto</Title>
                  {!isEditing && (
                    <Badge
                      color={product.isActive ? "green" : "red"}
                      variant="light"
                    >
                      {product.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  )}
                </Group>
              </Card.Section>

              {isEditing ? (
                <Stack>
                  <TextInput
                    label="Nome do Produto"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                  <SimpleGrid cols={2}>
                    <Select
                      label="Categoria"
                      data={[
                        "Camisetas",
                        "Calças",
                        "Vestidos",
                        "Blusas",
                        "Saias",
                      ]}
                      value={editForm.category}
                      onChange={(value) =>
                        setEditForm((prev) => ({
                          ...prev,
                          category: value || "",
                        }))
                      }
                      required
                    />
                    <TextInput
                      label="Marca"
                      value={editForm.brand}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          brand: e.target.value,
                        }))
                      }
                    />
                  </SimpleGrid>
                  <SimpleGrid cols={2}>
                    <TextInput
                      label="Fornecedor"
                      value={editForm.supplier}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          supplier: e.target.value,
                        }))
                      }
                    />
                    <NumberInput
                      label="Preço Base (R$)"
                      value={editForm.basePrice}
                      onChange={(value) =>
                        setEditForm((prev) => ({
                          ...prev,
                          basePrice: Number(value),
                        }))
                      }
                      decimalScale={2}
                      fixedDecimalScale
                      prefix="R$ "
                      required
                    />
                  </SimpleGrid>
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
                    label="Produto ativo"
                    description="Produtos inativos não aparecem nas listagens"
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
                    <Title order={3}>{product.name}</Title>
                  </div>
                  <SimpleGrid cols={2}>
                    <div>
                      <Text size="sm" fw={500} c="dimmed" mb={4}>
                        Categoria
                      </Text>
                      <Badge variant="light" color="blue">
                        {product.category}
                      </Badge>
                    </div>
                    <div>
                      <Text size="sm" fw={500} c="dimmed" mb={4}>
                        Marca
                      </Text>
                      <Text>{product.brand}</Text>
                    </div>
                  </SimpleGrid>
                  <SimpleGrid cols={2}>
                    <div>
                      <Text size="sm" fw={500} c="dimmed" mb={4}>
                        Fornecedor
                      </Text>
                      <Text>{product.supplier}</Text>
                    </div>
                    <div>
                      <Text size="sm" fw={500} c="dimmed" mb={4}>
                        Preço Base
                      </Text>
                      <Text fw={500} size="lg">
                        R$ {product.basePrice.toFixed(2)}
                      </Text>
                    </div>
                  </SimpleGrid>
                  <div>
                    <Text size="sm" fw={500} c="dimmed" mb={4}>
                      Descrição
                    </Text>
                    <Text>{product.description}</Text>
                  </div>
                  <SimpleGrid cols={2}>
                    <div>
                      <Text size="sm" fw={500} c="dimmed" mb={4}>
                        Criado em
                      </Text>
                      <Group gap="xs">
                        <IconCalendar
                          size={16}
                          color="var(--mantine-color-gray-6)"
                        />
                        <Text size="sm">{formatDate(product.createdAt)}</Text>
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
                        <Text size="sm">{formatDate(product.updatedAt)}</Text>
                      </Group>
                    </div>
                  </SimpleGrid>
                </Stack>
              )}
            </Card>
          </div>

          {/* Estatísticas */}
          <Stack>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500} c="dimmed">
                  Estoque Total
                </Text>
                <IconPackage size={16} color="var(--mantine-color-blue-6)" />
              </Group>
              <Title order={2} c="blue">
                {totalStock}
              </Title>
              <Text size="xs" c="dimmed">
                unidades em {variations.length} variações
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
                  Imagens
                </Text>
                <IconPhoto size={16} color="var(--mantine-color-purple-6)" />
              </Group>
              <Title order={2} c="purple">
                {totalImages}
              </Title>
              <Text size="xs" c="dimmed">
                total de imagens
              </Text>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500} c="dimmed">
                  Alertas
                </Text>
                <IconAlertTriangle
                  size={16}
                  color="var(--mantine-color-yellow-6)"
                />
              </Group>
              <Group>
                <div>
                  <Title order={3} c="yellow">
                    {lowStockCount}
                  </Title>
                  <Text size="xs" c="dimmed">
                    estoque baixo
                  </Text>
                </div>
                <Divider orientation="vertical" />
                <div>
                  <Title order={3} c="red">
                    {outOfStockCount}
                  </Title>
                  <Text size="xs" c="dimmed">
                    sem estoque
                  </Text>
                </div>
              </Group>
            </Card>
          </Stack>
        </SimpleGrid>

        {/* Variações do Produto */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="md">
            <Group justify="space-between">
              <div>
                <Title order={4}>Variações do Produto</Title>
                <Text size="sm" c="dimmed">
                  Diferentes tamanhos, cores e múltiplas imagens
                </Text>
              </div>
              <Button
                size="sm"
                leftSection={<IconPlus size={14} />}
                onClick={() => setShowNewVariationModal(true)}
              >
                Nova Variação
              </Button>
            </Group>
          </Card.Section>

          {variations.length > 0 ? (
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
                {variations.map((variation) => (
                  <Table.Tr key={variation.id}>
                    <Table.Td>
                      <Group gap="xs">
                        <ImageCarousel images={variation.images} size={60} />
                        {variation.images.length > 0 && (
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
                        )}
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500} size="sm">
                        {variation.sku}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="outline" size="sm">
                        {variation.size}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" size="sm">
                        {variation.color}
                      </Badge>
                    </Table.Td>
                    <Table.Td>R$ {variation.price.toFixed(2)}</Table.Td>
                    <Table.Td>
                      <Text fw={500}>{variation.stock}</Text>
                      <Text size="xs" c="dimmed">
                        min: {variation.minStock}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(variation.status)} size="sm">
                        {getStatusLabel(variation.status)}
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
                            onClick={() => handleEditVariation(variation)}
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
                            onClick={() => handleRemoveVariation(variation.id)}
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
          ) : (
            <Paper p="xl" withBorder>
              <Flex direction="column" align="center" gap="md">
                <IconPackage size={48} color="var(--mantine-color-gray-5)" />
                <Text c="dimmed">Nenhuma variação cadastrada</Text>
                <Button
                  variant="light"
                  leftSection={<IconPlus size={16} />}
                  onClick={() => setShowNewVariationModal(true)}
                >
                  Adicionar Primeira Variação
                </Button>
              </Flex>
            </Paper>
          )}
        </Card>

        {/* Modal Nova Variação */}
        <Modal
          opened={showNewVariationModal}
          onClose={() => setShowNewVariationModal(false)}
          title="Nova Variação"
          size="lg"
        >
          <Stack>
            <TextInput
              label="SKU"
              placeholder="Ex: CAM-BAS-P-AZ"
              value={newVariation.sku}
              onChange={(e) =>
                setNewVariation((prev) => ({ ...prev, sku: e.target.value }))
              }
              required
            />
            <SimpleGrid cols={2}>
              <Select
                label="Tamanho"
                placeholder="Selecione..."
                data={["PP", "P", "M", "G", "GG", "XG"]}
                value={newVariation.size}
                onChange={(value) =>
                  setNewVariation((prev) => ({ ...prev, size: value || "" }))
                }
                required
              />
              <Select
                label="Cor"
                placeholder="Selecione..."
                data={[
                  "Branco",
                  "Preto",
                  "Azul",
                  "Vermelho",
                  "Verde",
                  "Amarelo",
                  "Rosa",
                  "Cinza",
                ]}
                value={newVariation.color}
                onChange={(value) =>
                  setNewVariation((prev) => ({ ...prev, color: value || "" }))
                }
                required
              />
            </SimpleGrid>
            <SimpleGrid cols={3}>
              <NumberInput
                label="Preço (R$)"
                value={newVariation.price}
                onChange={(value) =>
                  setNewVariation((prev) => ({ ...prev, price: Number(value) }))
                }
                decimalScale={2}
                fixedDecimalScale
                prefix="R$ "
                required
              />
              <NumberInput
                label="Estoque"
                value={newVariation.stock}
                onChange={(value) =>
                  setNewVariation((prev) => ({ ...prev, stock: Number(value) }))
                }
                min={0}
                required
              />
              <NumberInput
                label="Estoque Mínimo"
                value={newVariation.minStock}
                onChange={(value) =>
                  setNewVariation((prev) => ({
                    ...prev,
                    minStock: Number(value),
                  }))
                }
                min={0}
                required
              />
            </SimpleGrid>

            {/* Upload de Múltiplas Imagens */}
            <Card withBorder>
              <Card.Section withBorder inheritPadding py="xs" mb="md">
                <Group>
                  <IconPhoto size={16} />
                  <Text fw={500}>Imagens da Variação</Text>
                  <Badge color="blue" size="sm">
                    Múltiplas imagens
                  </Badge>
                </Group>
              </Card.Section>

              <Stack>
                <FileInput
                  label="Selecionar Imagens"
                  placeholder="Clique para selecionar múltiplas imagens"
                  accept="image/*"
                  multiple
                  leftSection={<IconUpload size={16} />}
                  value={newVariation.images}
                  onChange={(files) =>
                    setNewVariation((prev) => ({
                      ...prev,
                      images: files || [],
                    }))
                  }
                />

                {newVariation.images.length > 0 && (
                  <Paper p="md" withBorder bg="var(--mantine-color-green-0)">
                    <Group mb="xs">
                      <IconCheck
                        size={16}
                        color="var(--mantine-color-green-6)"
                      />
                      <Text size="sm" c="green" fw={500}>
                        {newVariation.images.length} imagem(ns) selecionada(s)
                      </Text>
                    </Group>
                    <ScrollArea>
                      <Group gap="xs">
                        {newVariation.images.map((file, index) => (
                          <Paper
                            key={index}
                            p="xs"
                            withBorder
                            bg="white"
                            style={{ minWidth: "120px" }}
                          >
                            <Text size="xs" truncate>
                              {file.name}
                            </Text>
                          </Paper>
                        ))}
                      </Group>
                    </ScrollArea>
                  </Paper>
                )}

                <Text size="xs" c="dimmed">
                  Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB por
                  imagem. Você pode selecionar múltiplas imagens de uma vez.
                </Text>
              </Stack>
            </Card>

            <Group justify="flex-end" mt="md">
              <Button
                variant="outline"
                onClick={() => setShowNewVariationModal(false)}
              >
                Cancelar
              </Button>
              <Button
                leftSection={<IconCheck size={16} />}
                onClick={handleAddVariation}
              >
                Adicionar Variação
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* Modal Editar Variação */}
        <Modal
          opened={showEditVariationModal}
          onClose={() => setShowEditVariationModal(false)}
          title="Editar Variação"
          size="lg"
        >
          <Stack>
            <TextInput
              label="SKU"
              value={variationForm.sku}
              onChange={(e) =>
                setVariationForm((prev) => ({ ...prev, sku: e.target.value }))
              }
              required
            />
            <SimpleGrid cols={2}>
              <Select
                label="Tamanho"
                data={["PP", "P", "M", "G", "GG", "XG"]}
                value={variationForm.size}
                onChange={(value) =>
                  setVariationForm((prev) => ({ ...prev, size: value || "" }))
                }
                required
              />
              <Select
                label="Cor"
                data={[
                  "Branco",
                  "Preto",
                  "Azul",
                  "Vermelho",
                  "Verde",
                  "Amarelo",
                  "Rosa",
                  "Cinza",
                ]}
                value={variationForm.color}
                onChange={(value) =>
                  setVariationForm((prev) => ({ ...prev, color: value || "" }))
                }
                required
              />
            </SimpleGrid>
            <SimpleGrid cols={3}>
              <NumberInput
                label="Preço (R$)"
                value={variationForm.price}
                onChange={(value) =>
                  setVariationForm((prev) => ({
                    ...prev,
                    price: Number(value),
                  }))
                }
                decimalScale={2}
                fixedDecimalScale
                prefix="R$ "
                required
              />
              <NumberInput
                label="Estoque"
                value={variationForm.stock}
                onChange={(value) =>
                  setVariationForm((prev) => ({
                    ...prev,
                    stock: Number(value),
                  }))
                }
                min={0}
                required
              />
              <NumberInput
                label="Estoque Mínimo"
                value={variationForm.minStock}
                onChange={(value) =>
                  setVariationForm((prev) => ({
                    ...prev,
                    minStock: Number(value),
                  }))
                }
                min={0}
                required
              />
            </SimpleGrid>

            <Switch
              label="Variação ativa"
              checked={variationForm.isActive}
              onChange={(e) =>
                setVariationForm((prev) => ({
                  ...prev,
                  isActive: e.currentTarget.checked,
                }))
              }
            />

            {/* Gerenciar Imagens Existentes */}
            {variationForm.images.length > 0 && (
              <Card withBorder>
                <Card.Section withBorder inheritPadding py="xs" mb="md">
                  <Group>
                    <IconPhoto size={16} />
                    <Text fw={500}>
                      Imagens Atuais ({variationForm.images.length})
                    </Text>
                  </Group>
                </Card.Section>

                <SimpleGrid cols={3} spacing="xs">
                  {variationForm.images.map((image, index) => (
                    <Paper key={index} pos="relative" withBorder>
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Imagem ${index + 1}`}
                        radius="sm"
                        fit="cover"
                        h={100}
                      />
                      <CloseButton
                        pos="absolute"
                        top={4}
                        right={4}
                        size="sm"
                        bg="rgba(0,0,0,0.7)"
                        c="white"
                        onClick={() => handleRemoveImage(index)}
                      />
                    </Paper>
                  ))}
                </SimpleGrid>
              </Card>
            )}

            {/* Adicionar Novas Imagens */}
            <Card withBorder>
              <Card.Section withBorder inheritPadding py="xs" mb="md">
                <Group>
                  <IconPlus size={16} />
                  <Text fw={500}>Adicionar Novas Imagens</Text>
                </Group>
              </Card.Section>

              <Stack>
                <FileInput
                  placeholder="Selecionar novas imagens"
                  accept="image/*"
                  multiple
                  leftSection={<IconUpload size={16} />}
                  value={variationForm.newImages}
                  onChange={(files) =>
                    setVariationForm((prev) => ({
                      ...prev,
                      newImages: files || [],
                    }))
                  }
                />

                {variationForm.newImages.length > 0 && (
                  <Paper p="md" withBorder bg="var(--mantine-color-blue-0)">
                    <Text size="sm" c="blue" fw={500} mb="xs">
                      {variationForm.newImages.length} nova(s) imagem(ns) para
                      adicionar
                    </Text>
                    <ScrollArea>
                      <Group gap="xs">
                        {variationForm.newImages.map((file, index) => (
                          <Paper
                            key={index}
                            p="xs"
                            withBorder
                            bg="white"
                            style={{ minWidth: "120px" }}
                          >
                            <Text size="xs" truncate>
                              {file.name}
                            </Text>
                          </Paper>
                        ))}
                      </Group>
                    </ScrollArea>
                  </Paper>
                )}
              </Stack>
            </Card>

            <Group justify="flex-end" mt="md">
              <Button
                variant="outline"
                onClick={() => setShowEditVariationModal(false)}
              >
                Cancelar
              </Button>
              <Button
                leftSection={<IconDeviceFloppy size={16} />}
                onClick={handleSaveVariation}
              >
                Salvar Alterações
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* Modal Galeria de Imagens */}
        <Modal
          opened={showImageGallery}
          onClose={() => setShowImageGallery(false)}
          title={galleryTitle}
          size="xl"
          centered
        >
          <SimpleGrid cols={2} spacing="md">
            {galleryImages.map((image, index) => (
              <Image
                key={index}
                src={image || "/placeholder.svg"}
                alt={`Imagem ${index + 1}`}
                radius="md"
                fit="cover"
                h={200}
              />
            ))}
          </SimpleGrid>
        </Modal>
      </Container>
    </AppShellLayout>
  );
}
