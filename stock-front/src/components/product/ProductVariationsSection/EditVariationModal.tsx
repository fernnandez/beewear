import {
  Button,
  Card,
  ColorInput,
  Modal,
  NumberInput,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { updateProductVariation } from "@services/productVariaton.service";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { getAxiosErrorMessage } from "@utils/getAxiosErrorMessage";
import { queryClient } from "@utils/queryClient";
import { Variation } from "./ProductVariationsSection";

interface EditVariationModalProps {
  opened: boolean;
  onClose: () => void;
  variation: Variation;
  productPublicId: string;
}

export interface EditVariationFormValue {
  name: string;
  color: string;
  price: number;
}

export function EditVariationModal({
  opened,
  onClose,
  variation,
  productPublicId,
}: EditVariationModalProps) {
  const form = useForm<EditVariationFormValue>({
    initialValues: {
      name: variation.name,
      color: variation.color,
      price: variation.price,
    },
    validate: {
      name: (value) => (value ? null : "Nome é obrigatório"),
      color: (value) => (value ? null : "Cor é obrigatória"),
      price: (value) => (value > 0 ? null : "Preço deve ser maior que 0"),
    },
  });

  const handleSubmit = async () => {
    const validation = form.validate();
    if (validation.hasErrors) {
      notifications.show({
        title: "Erro no formulário",
        message: "Preencha todos os campos obrigatórios.",
        color: "red",
      });
      return;
    }

    try {
      await updateProductVariation(variation.publicId, form.values);
      notifications.show({
        title: "Variação atualizada",
        message: `Variação "${form.values.name}" atualizada com sucesso.`,
        color: "green",
      });
      queryClient.invalidateQueries({
        queryKey: ["product-details", productPublicId],
      });
      onClose();
    } catch (error) {
      notifications.show({
        title: "Erro",
        message: getAxiosErrorMessage(error, "Erro ao atualizar variação."),
        color: "red",
      });
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Editar Variação" size="lg">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Card withBorder padding="md" mb="md">
          <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
            <TextInput
              label="Nome da variação"
              placeholder="Ex: Azul Royal"
              key={form.key("name")}
              {...form.getInputProps("name")}
              withAsterisk
            />
            <ColorInput
              label="Cor"
              key={form.key("color")}
              {...form.getInputProps("color")}
              withAsterisk
            />
            <NumberInput
              label="Preço"
              prefix="R$ "
              key={form.key("price")}
              {...form.getInputProps("price")}
              withAsterisk
            />
          </SimpleGrid>
          <Button
            fullWidth
            leftSection={<IconDeviceFloppy size={16} />}
            type="submit"
          >
            Salvar Alterações
          </Button>
        </Card>
      </form>
    </Modal>
  );
}
