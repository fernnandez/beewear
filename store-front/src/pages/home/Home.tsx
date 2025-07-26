import { ProductGallery } from "@components/product/ProductGallery/ProductGallery";
import {
  Box,
  Center,
  Container,
  Grid,
  Image,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { IconTruck, IconUser } from "@tabler/icons-react";

export const Home = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <>
      <Box py={40}>
        <Container size="xl">
          <Grid align="center">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="xs">
                <Title
                  order={1}
                  size="2.5rem"
                  fw={300}
                  c={isDark ? "white" : "dark"}
                  lh={1.2}
                >
                  Roupa fitness
                </Title>
                <Text span fw={700} c="yellow.6">
                  premium
                </Text>
                <Text size="lg" c="dimmed" maw={400}>
                  Qualidade, conforto e estilo para os teus treinos diários.
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Center>
                <Image
                  src="https://res.cloudinary.com/dm1cthyvc/image/upload/beewear/test.png"
                  alt="BeeWear"
                  radius="sm"
                  maw={800}
                />
              </Center>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* Products Section */}
      <ProductGallery />

      {/* Features Section */}
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
