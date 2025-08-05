import { ProductFormValues } from "@localTypes/product";
import {
  Button,
  Card,
  ColorInput,
  FileInput,
  NumberInput,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconTrash, IconUpload } from "@tabler/icons-react";

type Props = {
  index: number;
  form: UseFormReturnType<ProductFormValues>;
  disableRemove?: boolean;
  onRemove: () => void;
};

export function ProductVariationForm({
  index,
  form,
  disableRemove,
  onRemove,
}: Props) {
  return (
    <Card withBorder padding="md" mb="md">
      <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
        <TextInput
          label="Nome da variação"
          placeholder="Ex: Azul Royal"
          key={form.key(`variations.${index}.name`)}
          {...form.getInputProps(`variations.${index}.name`)}
          withAsterisk
        />
        <ColorInput
          label="Cor"
          key={form.key(`variations.${index}.color`)}
          {...form.getInputProps(`variations.${index}.color`)}
          withAsterisk
        />
        <NumberInput
          label="Preço"
          prefix="€ "
          key={form.key(`variations.${index}.price`)}
          {...form.getInputProps(`variations.${index}.price`)}
          withAsterisk
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
        <NumberInput
          label="Preço de compra"
          prefix="€ "
          key={form.key(`variations.${index}.price`)}
          {...form.getInputProps(`variations.${index}.price`)}
          withAsterisk
        />
        <NumberInput
          label="Preço de venda"
          prefix="€ "
          key={form.key(`variations.${index}.price`)}
          {...form.getInputProps(`variations.${index}.price`)}
          withAsterisk
        />
        <NumberInput
          label="IVA"
          prefix="% "
          key={form.key(`variations.${index}.price`)}
          {...form.getInputProps(`variations.${index}.price`)}
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
          key={form.key(`variations.${index}.imageFiles`)}
          {...form.getInputProps(`variations.${index}.imageFiles`)}
          clearable
        />
      </SimpleGrid>

      <Button
        color="red"
        variant="subtle"
        px={4}
        onClick={onRemove}
        disabled={disableRemove}
      >
        <IconTrash size={18} />
      </Button>
    </Card>
  );
}
