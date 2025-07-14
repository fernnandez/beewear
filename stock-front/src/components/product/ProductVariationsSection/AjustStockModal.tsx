import {
  Box,
  Button,
  Group,
  Modal,
  NumberInput,
  Paper,
  Stack,
  Text,
  Textarea,
  ThemeIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { adjustStock } from "@services/stock.service";
import {
  IconDeviceFloppy,
  IconEqual,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";
import { getAxiosErrorMessage } from "@utils/getAxiosErrorMessage";
import { queryClient } from "@utils/queryClient";

interface AdjustStockModalProps {
  opened: boolean;
  onClose: () => void;
  variationName: string;
  variationColor: string;
  productPublicId: string;
  size: {
    size: string;
    stock: {
      quantity: number;
      publicId: string;
    };
  };
}

export const AdjustStockModal = ({
  opened,
  onClose,
  variationName,
  variationColor,
  productPublicId,
  size,
}: AdjustStockModalProps) => {
  const { colorScheme } = useMantineColorScheme();

  function getBgColor(lightColor: string, darkColor: string) {
    return colorScheme === "light" ? lightColor : darkColor;
  }

  const form = useForm({
    initialValues: {
      newQuantity: size.stock.quantity,
      description: "",
    },

    validate: {
      newQuantity: (value) => {
        if (value < 0) return "Quantidade não pode ser negativa";
        if (value === size.stock.quantity)
          return "Quantidade deve ser diferente do estoque atual";
        return null;
      },
    },
  });

  const getMovementType = () => {
    const difference = form.values.newQuantity - size.stock.quantity;
    if (difference > 0)
      return { type: "IN", icon: IconTrendingUp, color: "green" };
    if (difference < 0)
      return { type: "OUT", icon: IconTrendingDown, color: "orange" };
    return { type: "NO CHANGE", icon: IconEqual, color: "gray" };
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = form.onSubmit(async (values) => {
    const movement = getMovementType();
    if (movement.type === "NO CHANGE") return;

    try {
      await adjustStock(size.stock.publicId, {
        quantity: values.newQuantity - size.stock.quantity,
        description: values.description,
      });

      notifications.show({
        title: "Estoque ajustado",
        message: `Estoque ajustado com sucesso.`,
        color: "green",
      });

      queryClient.invalidateQueries({
        queryKey: ["product-details", productPublicId],
      });

      handleClose();
    } catch (error) {
      notifications.show({
        title: "Erro",
        message: getAxiosErrorMessage(
          error,
          "Erro desconhecido ao ajustar o estoque."
        ),
        color: "red",
      });
    }
  });

  const movement = getMovementType();
  const difference = Math.abs(form.values.newQuantity - size.stock.quantity);

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Ajustar Estoque"
      size="xl"
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          <Paper
            p="md"
            withBorder
            bg={getBgColor("var(--mantine-color-gray-0)", "var(--mantine-color-dark-7)")}
          >
            <Group>
              <Box
                w={24}
                h={24}
                style={{
                  backgroundColor: variationColor,
                  borderRadius: "50%",
                  border: "2px solid var(--mantine-color-gray-3)",
                }}
              />
              <div>
                <Text fw={500}>
                  {variationName} - {size.size}
                </Text>
                <Text size="sm" c="dimmed">
                  Estoque atual: {size.stock.quantity} unidades
                </Text>
              </div>
            </Group>
          </Paper>

          <NumberInput
            label="Nova Quantidade"
            description="Informe a quantidade total em estoque"
            min={0}
            step={1}
            allowDecimal={false}
            required
            {...form.getInputProps("newQuantity")}
          />

          {movement.type !== "NO CHANGE" && (
            <Paper p="md" withBorder>
              <Group>
                <ThemeIcon color={movement.color} variant="light" size="sm">
                  <movement.icon size={16} />
                </ThemeIcon>
                <div>
                  <Text fw={500} c={movement.color}>
                    {movement.type === "IN" ? "Entrada" : "Saída"} de{" "}
                    {difference} unidades
                  </Text>
                  <Text size="sm" c="dimmed">
                    {movement.type === "IN"
                      ? "Será registrada uma entrada no estoque"
                      : "Será registrada uma saída do estoque"}
                  </Text>
                </div>
              </Group>
            </Paper>
          )}

          <Textarea
            label="Descrição (Opcional)"
            description="Motivo do ajuste de estoque"
            placeholder="Ex: Reposição de estoque, Correção de inventário..."
            minRows={3}
            {...form.getInputProps("description")}
          />

          <Group justify="flex-end" mt="md">
            <Button
              leftSection={<IconDeviceFloppy size={16} />}
              type="submit"
              disabled={movement.type === "NO CHANGE"}
            >
              Ajustar Estoque
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
