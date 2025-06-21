import { Button, Flex, Paper, Text } from "@mantine/core";
import { IconSection } from "@tabler/icons-react";

interface Props {
  onResetSearch: () => void;
  showReset: boolean;
}

export const CollectionEmptyState = ({ onResetSearch, showReset }: Props) => (
  <Paper p="xl" withBorder>
    <Flex direction="column" align="center" gap="md">
      <IconSection size={48} color="var(--mantine-color-gray-5)" />
      <Text c="dimmed">Nenhuma coleção encontrada</Text>
      {showReset && (
        <Button variant="light" onClick={onResetSearch}>
          Limpar busca
        </Button>
      )}
    </Flex>
  </Paper>
);
