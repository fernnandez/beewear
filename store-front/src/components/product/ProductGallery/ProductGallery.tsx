import {
  Button,
  Card,
  Center,
  Container,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { DARK_COLOR } from "@utils/constants";
import { useNavigate } from "react-router";
import { useCollections, useProducts } from "../../../hooks/useProducts";
import { formatPrice } from "../../../utils/formatPrice";
import { Loading } from "../../shared/Loading/Loading";

export const ProductGallery = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { data: products, isLoading: isLoadingProducts, error } = useProducts();
  const { data: collections, isLoading: isLoadingCollections } =
    useCollections();

  if (isLoadingProducts || isLoadingCollections) {
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
      <Group justify="space-between" align="flex-end" w={"100%"} mb={"xl"}>
        <Title order={2} fw={300} size="1.8rem" c={isDark ? "white" : "dark"}>
          Produtos
        </Title>
        <Group gap="xs">
          <Button variant={"filled"} color={"dark"} size="xs" radius="sm">
            Todos
          </Button>
          {collections?.map((collection) => (
            <Button
              key={collection.publicId}
              variant={"subtle"}
              color={"dark"}
              size="xs"
              radius="sm"
            >
              {collection.name}
            </Button>
          ))}
        </Group>
      </Group>

      {products?.length === 0 ? (
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
          <Grid gutter={{ base: "md", sm: "md", md: "md", lg: "lg" }}>
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
                      <div style={{ position: "relative", aspectRatio: "3/4" }}>
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
    </Container>
  );
};
