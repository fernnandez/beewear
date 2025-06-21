import { AppShellLayout } from "@components/AppShell";
import { CollectionForm } from "@components/collection/newCollectionForm";
import { Button, Container, Group, Text, Title } from "@mantine/core";
import { IconArrowBackUp } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function NewCollectionPage() {
  return (
    <AppShellLayout>
      <Container size="md">
        <Group justify="space-between" mb="xl">
          <div>
            <Title order={2}>Nova Coleção</Title>
            <Text c="dimmed">
              Crie uma nova coleção para organizar seus produtos
            </Text>
          </div>
          <Button
            variant="light"
            component={Link}
            to="/collections"
            leftSection={<IconArrowBackUp size={16} />}
          >
            Coleções
          </Button>
        </Group>

        <CollectionForm />
      </Container>
    </AppShellLayout>
  );
}
