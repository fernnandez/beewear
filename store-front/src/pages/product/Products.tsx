import { ProductPreview } from "@components/product/ProductPreview/ProductPreview";
import {
  Box,
  Container,
  Grid,
  Stack,
  Text,
  useMantineColorScheme,
  Center,
} from "@mantine/core";
import { IconTruck, IconUser } from "@tabler/icons-react";
import { useParams } from "react-router";
import { useProduct } from "../../hooks/useProducts";
import { Loading } from "../../components/shared/Loading/Loading";

export const Products = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const { publicId } = useParams<{ publicId: string }>();
  
  const { data: product, isLoading, error } = useProduct(publicId || "");

  if (isLoading) {
    return (
      <Container size="xl" py={60}>
        <Center>
          <Loading />
        </Center>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container size="xl" py={60}>
        <Center>
          <Stack align="center" gap="md">
            <Text size="lg" c="red">
              Produto não encontrado
            </Text>
            <Text size="sm" c="dimmed">
              O produto que você está procurando não existe ou foi removido.
            </Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <>
      <ProductPreview product={product} />
      <Box py={30}>
        <Container size="xl">
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack align="center" gap="sm">
                <IconTruck
                  size={32}
                  color={isDark ? "white" : "var(--mantine-color-dark-6)"}
                />
                <Text fw={500} size="md" ta="center">
                  Envio Grátis
                </Text>
                <Text size="sm" c="dimmed" ta="center">
                  Acima de €50
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack align="center" gap="sm">
                <IconUser
                  size={32}
                  color={isDark ? "white" : "var(--mantine-color-dark-6)"}
                />
                <Text fw={500} size="md" ta="center">
                  Qualidade Premium
                </Text>
                <Text size="sm" c="dimmed" ta="center">
                  Materiais duráveis
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack align="center" gap="sm">
                <IconTruck
                  size={32}
                  color={isDark ? "white" : "var(--mantine-color-dark-6)"}
                />
                <Text fw={500} size="md" ta="center">
                  30 Dias
                </Text>
                <Text size="sm" c="dimmed" ta="center">
                  Trocas e devoluções
                </Text>
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
    </>
  );
};
