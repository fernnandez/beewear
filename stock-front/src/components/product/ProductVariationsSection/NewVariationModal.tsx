import { ProductVariationFormValues } from "@localTypes/product";
import {
  Button,
  Card,
  ColorInput,
  FileInput,
  Modal,
  NumberInput,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { createProductVariation } from "@services/productVariaton.service";
import { IconDeviceFloppy, IconUpload } from "@tabler/icons-react";
import { getAxiosErrorMessage } from "@utils/getAxiosErrorMessage";
import { queryClient } from "@utils/queryClient";

interface EditImagesModalProps {
  opened: boolean;
  onClose: () => void;
  productPublicId: string;
}

export function NewVariationModal({
  opened,
  onClose,
  productPublicId,
}: EditImagesModalProps) {
  const form = useForm<ProductVariationFormValues>({
    initialValues: {
      name: "",
      color: "",
      price: 0,
      imageFiles: [],
    },
    validate: {
      name: (value: string) => (value ? null : "Nome é obrigatório"),
      color: (value: string) => (value ? null : "Cor é obrigatória"),
      price: (value: number) =>
        value > 0 ? null : "Preço o deve ser maior que 0",
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
      await createProductVariation(productPublicId, form.values);
      notifications.show({
        title: "Produto criado",
        message: `Produto "${form.values.name}" salvo.`,
        color: "green",
      });
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["product-details", productPublicId],
      });
      onClose();
    } catch (error) {
      notifications.show({
        title: "Erro",
        message: getAxiosErrorMessage(
          error,
          "Erro desconhecido ao criar produto."
        ),
        color: "red",
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Adicionar Nova variação`}
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Card withBorder padding="md" mb="md">
          <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
            <TextInput
              label="Nome da variação"
              placeholder="Ex: Azul Royal"
              key={form.key(`name`)}
              {...form.getInputProps(`name`)}
              withAsterisk
            />
            <ColorInput
              label="Cor"
              key={form.key(`color`)}
              {...form.getInputProps(`color`)}
              withAsterisk
            />
            <NumberInput
              label="Preço"
              prefix="R$ "
              key={form.key(`price`)}
              {...form.getInputProps(`price`)}
              withAsterisk
            />
          </SimpleGrid>
          <SimpleGrid cols={{ base: 1, sm: 1 }} mb="md">
            <FileInput
              leftSection={<IconUpload size={16} />}
              label="Imagens da variação"
              description="Imagens da variação exibidas na vitrine"
              accept="image/*"
              multiple
              key={form.key(`imageFiles`)}
              {...form.getInputProps(`imageFiles`)}
              clearable
            />
          </SimpleGrid>
          <Button
            fullWidth
            leftSection={<IconDeviceFloppy size={16} />}
            onClick={handleSubmit}
            //TODO: INCLUIR O DISABLED
          >
            Salvar
          </Button>
        </Card>
      </form>
    </Modal>
  );
}
