import { ProductVariationSize } from "@localTypes/product";
import { Badge, Button, Group, Table, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconHistory } from "@tabler/icons-react";
import { AdjustStockModal } from "./AjustStockModal";
import { MovementHistoryModal } from "./MovementHistoryModal";

export const ProductVariationSizeLine = ({
  variationName,
  variationColor,
  productPublicId,
  size,
}: {
  variationName: string;
  variationColor: string;
  productPublicId: string;
  size: ProductVariationSize;
}) => {
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);
  const [
    movementHistoryModalOpened,
    { open: openMovementHistoryModal, close: closeMovementHistoryModal },
  ] = useDisclosure(false);
  return (
    <>
      <Table.Tr key={size.stock.publicId}>
        <Table.Td>
          <Badge variant="light" color="gray" size="sm">
            {size.size}
          </Badge>
        </Table.Td>
        <Table.Td>
          <Text fw={500}>{size.stock.quantity}</Text>
        </Table.Td>
        <Table.Td>
          <Badge
            color={size.stock.quantity > 0 ? "green" : "red"}
            variant="light"
            size="sm"
          >
            {size.stock.quantity > 0 ? "Disponível" : "Sem Estoque"}
          </Badge>
        </Table.Td>
        <Table.Td>
          <Group gap="xs">
            <Button
              variant="light"
              size="sm"
              radius="xl"
              onClick={openEditModal}
              leftSection={<IconEdit size={16} />}
            >
              Ajustar Estoque
            </Button>
            <Button
              variant="light"
              size="sm"
              radius="xl"
              color="blue"
              leftSection={<IconHistory size={16} />}
              onClick={openMovementHistoryModal}
            >
              Historico
            </Button>
          </Group>
        </Table.Td>
      </Table.Tr>

      {editModalOpened && (
        <AdjustStockModal
          opened={editModalOpened}
          onClose={closeEditModal}
          variationName={variationName}
          variationColor={variationColor}
          productPublicId={productPublicId}
          size={size}
        />
      )}

      {movementHistoryModalOpened && (
        <MovementHistoryModal
          opened={movementHistoryModalOpened}
          onClose={closeMovementHistoryModal}
          stockItemPublicId={size.stock.publicId}
          variationColor={variationColor}
          size={size}
        />
      )}
    </>
  );
};
