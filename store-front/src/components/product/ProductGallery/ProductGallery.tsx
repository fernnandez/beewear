import {
  Button,
  Card,
  Center,
  Container,
  Grid,
  Group,
  Image,
  Select,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useDebouncedValue, useMediaQuery } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { DARK_COLOR } from "@utils/constants";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  useCollections,
  useProductsPaginated,
} from "../../../hooks/useProducts";
import { formatPrice } from "../../../utils/formatPrice";
import { Loading } from "../../shared/Loading/Loading";
import { Pagination } from "../../shared/Pagination/Pagination";

export const ProductGallery = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const navigate = useNavigate();
  const productsRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Estado local para busca com debounce
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchValue, 500);

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error,
    filters,
    updateFilters,
    updateSearchOnly,
    goToPage,
    paginationInfo,
  } = useProductsPaginated({
    initialLimit: 12,
  });

  const { data: collections, isLoading: isLoadingCollections } =
    useCollections();

  const products = productsData?.data || [];

  // Atualizar filtro de busca quando debouncedSearch muda
  useMemo(() => {
    if (debouncedSearch !== filters.search) {
      updateSearchOnly(debouncedSearch);
    }
  }, [debouncedSearch, filters.search, updateSearchOnly]);

  if (isLoadingCollections) {
    return (
      <Container size="xl" py={60}>
        <Center>
          <Loading />
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py={60}>
        <Center>
          <Text c="red" size="lg">
            Erro ao carregar produtos. Tente novamente mais tarde.
          </Text>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="xl" py={60}>
      <Stack gap="xl">
        <Stack gap="md">
          <Title order={2} fw={300} size="1.8rem" c={isDark ? "white" : "dark"}>
            Produtos
          </Title>
          <Group justify="space-between" align="center" wrap="wrap" gap="md">
            <TextInput
              placeholder="Buscar produtos..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.currentTarget.value)}
              leftSection={<IconSearch size={16} />}
              size="sm"
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Selecionar coleção"
              value={filters.collectionId || ""}
              onChange={(value) =>
                updateFilters({
                  collectionId: value === "" ? undefined : value || undefined,
                })
              }
              data={[
                { value: "", label: "Todas as coleções" },
                ...(collections?.map((collection) => ({
                  value: collection.publicId,
                  label: collection.name,
                })) || []),
              ]}
              clearable
              size="sm"
              style={{ flex: 1 }}
              searchable
            />
          </Group>
        </Stack>

        {/* Loading dos produtos */}
        {isLoadingProducts ? (
          <Grid gutter={{ base: "md", sm: "md", md: "md", lg: "lg" }}>
            {Array.from({ length: 12 }).map((_, index) => (
              <Grid.Col key={index} span={{ base: 6, lg: 4 }}>
                <Card shadow="sm" padding={0} radius="md" withBorder>
                  <Card.Section>
                    <Skeleton height={300} />
                  </Card.Section>
                  <Stack gap="xs" p={{ base: "xs", sm: "sm", md: "md" }}>
                    <Skeleton height={20} width="80%" />
                    <Skeleton height={16} width="60%" />
                    <Skeleton height={32} width="100%" />
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        ) : products?.length === 0 ? (
          <Center py={60}>
            <Stack align="center" gap="md">
              <Text size="lg" c="dimmed">
                Nenhum produto encontrado
              </Text>
              <Text size="sm" c="dimmed">
                Tente ajustar os filtros ou volte mais tarde
              </Text>
            </Stack>
          </Center>
        ) : (
          <>
            <Grid
              ref={productsRef}
              gutter={{ base: "md", sm: "md", md: "md", lg: "lg" }}
            >
              {products?.map((product) => {
                // Pega a primeira variação com imagens
                const firstVariation = product.variations.find(
                  (v) => v.images && v.images.length > 0
                );
                const productImage =
                  firstVariation?.images[0] || "/placeholder.svg";
                const productPrice = firstVariation?.price;

                return (
                  <Grid.Col key={product.publicId} span={{ base: 6, lg: 4 }}>
                    <Card
                      onClick={
                        isMobile
                          ? () => navigate(`/product/${product.publicId}`)
                          : () => {}
                      }
                      shadow="sm"
                      padding={0}
                      radius="md"
                      withBorder
                      style={{
                        backgroundColor: isDark ? DARK_COLOR : "white",
                        height: "100%",
                        transition: "box-shadow 0.2s ease",
                        cursor: "pointer",
                      }}
                      styles={{
                        root: {
                          "&:hover": {
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          },
                        },
                      }}
                    >
                      {/* Imagem do produto */}
                      <Card.Section>
                        <div
                          style={{ position: "relative", aspectRatio: "3/4" }}
                        >
                          <Image
                            src={productImage}
                            alt={product.name}
                            h={{ base: 300, sm: 300, md: 400, lg: 600 }}
                            fit="cover"
                            style={{
                              transition: "transform 0.3s ease",
                            }}
                            styles={{
                              root: {
                                "&:hover img": {
                                  transform: "scale(1.05)",
                                },
                              },
                            }}
                          />
                        </div>
                      </Card.Section>

                      {/* Conteúdo do card */}
                      <Stack
                        gap="xs"
                        p={{ base: "xs", sm: "sm", md: "md" }}
                        style={{ flexGrow: 1 }}
                      >
                        {/* Nome do produto */}
                        <Text
                          fw={600}
                          size="md"
                          c={isDark ? "white" : "dark"}
                          style={{ lineHeight: 1.2, flexGrow: 1 }}
                        >
                          {product.name}
                        </Text>

                        {/* Preço */}
                        <Title order={4} fw={400}>
                          {formatPrice(productPrice)}
                        </Title>

                        {/* Botão */}
                        {!isMobile && (
                          <Button
                            variant="outline"
                            color={isDark ? "white" : "dark"}
                            fullWidth
                            size="sm"
                            radius="md"
                            onClick={() =>
                              navigate(`/product/${product.publicId}`)
                            }
                            styles={{
                              root: {
                                borderColor: "#dee2e6",
                              },
                            }}
                          >
                            Ver produto
                          </Button>
                        )}
                      </Stack>
                    </Card>
                  </Grid.Col>
                );
              })}
            </Grid>
          </>
        )}

        {paginationInfo && paginationInfo.totalPages > 1 && (
          <Pagination
            paginationInfo={paginationInfo}
            onPageChange={goToPage}
            showInfo={true}
            scrollToRef={productsRef}
            size="sm"
          />
        )}
      </Stack>
    </Container>
  );
};
