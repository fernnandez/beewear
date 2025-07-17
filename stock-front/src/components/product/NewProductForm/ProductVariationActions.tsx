import { Button, Flex } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";

type ProductVariationActionsProps = {
  onAdd: () => void;
  onClean: () => void;
  disableClean?: boolean;
};

export function ProductVariationActions({
  onAdd,
  onClean,
  disableClean,
}: ProductVariationActionsProps) {
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
