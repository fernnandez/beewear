import { Button, Container, Group, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <Container style={{ textAlign: "center", paddingTop: 100 }}>
      <Title order={1}>404 - Página não encontrada</Title>
      <Text size="lg" mt="md">
        A página que está a tentar aceder não existe ou foi movida.
      </Text>
      <Group justify="center" mt="xl">
        <Button component={Link} to="/" variant="filled" color="blue">
          Voltar para o início
        </Button>
      </Group>
    </Container>
  );
};
