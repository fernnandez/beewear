import { Card, Group, TextInput, Title } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

interface Props {
  searchTerm: string;
  onSearch: (value: string) => void;
}

export const CollectionSearch = ({ searchTerm, onSearch }: Props) => (
  <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
    <Card.Section withBorder inheritPadding py="xs" mb="md">
      <Group>
        <IconSearch size={18} />
        <Title order={4}>Buscar Coleções</Title>
      </Group>
    </Card.Section>
    <TextInput
      placeholder="Buscar por nome ou descrição..."
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
      leftSection={<IconSearch size={16} />}
      style={{ maxWidth: "400px" }}
    />
  </Card>
);
