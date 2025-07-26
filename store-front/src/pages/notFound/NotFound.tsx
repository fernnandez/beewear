import { Box, Button, Group, Text, Title } from "@mantine/core";
import { Link } from "react-router";

export const NotFoundPage = () => {
  return (
    <Box
      style={{
        minHeight: "calc(100vh - 60px)",
        textAlign: "center",
        paddingTop: 100,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Title order={1}>404 - Página não encontrada</Title>
      <Text size="lg" mt="md">
        A página que você está tentando acessar não existe ou foi movida.
      </Text>
      <Group justify="center" mt="xl">
        <Button component={Link} to="/" variant="filled" color="yellow">
          Voltar para o início
        </Button>
      </Group>
    </Box>
  );
};
