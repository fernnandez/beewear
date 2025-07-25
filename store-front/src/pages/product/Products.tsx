import { ProductPreview } from "@components/product/ProductPreview/ProductPreview";
import { Box, Container, Grid, Stack, Text } from "@mantine/core";
import { IconTruck, IconUser } from "@tabler/icons-react";

export const Products = () => {
  return (
    <>
      <ProductPreview />
      <Box py={30} style={{ backgroundColor: "#fafafa" }}>
        <Container size="xl">
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack align="center" gap="sm">
                <IconTruck size={32} color="var(--mantine-color-dark-6)" />
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
                <IconUser size={32} color="var(--mantine-color-dark-6)" />
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
                <IconTruck size={32} color="var(--mantine-color-dark-6)" />
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
