import { Button, Flex } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";

type VariationActionsProps = {
  onAdd: () => void;
  onClean: () => void;
  disableClean?: boolean;
};

export function VariationActions({
  onAdd,
  onClean,
  disableClean,
}: VariationActionsProps) {
  return (
    <Flex justify="center" gap="md" mt="md" mb="md">
      <Button
        color="red"
        onClick={onClean}
        variant="outline"
        leftSection={<IconTrash size={16} />}
        fullWidth
        style={{ flex: 1 }}
        disabled={disableClean}
      >
        Limpar Variações
      </Button>

      <Button
        onClick={onAdd}
        variant="outline"
        leftSection={<IconPlus size={16} />}
        fullWidth
        style={{ flex: 1 }}
      >
        Adicionar Variação
      </Button>
    </Flex>
  );
}
