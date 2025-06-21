import {
  Button,
  Card,
  ColorInput,
  Flex,
  NumberInput,
  Select,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconTrash } from "@tabler/icons-react";
import type { ProductFormValues } from "src/types/product";

const sizes = ["PP", "P", "M", "G", "GG"];

type Props = {
  index: number;
  form: UseFormReturnType<ProductFormValues>;
  disableRemove?: boolean;
  onRemove: () => void;
};

export function ProductVariationCard({
  index,
  form,
  disableRemove,
  onRemove,
}: Props) {
  return (
    <Card withBorder padding="md" mb="md">
      <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
        <ColorInput
          label="Cor"
          key={form.key(`variations.${index}.color`)}
          {...form.getInputProps(`variations.${index}.color`)}
          withAsterisk
        />
        <Select
          label="Tamanho"
          data={sizes}
          clearable
          key={form.key(`variations.${index}.size`)}
          {...form.getInputProps(`variations.${index}.size`)}
          withAsterisk
        />
        <NumberInput
          label="Preço"
          prefix="R$ "
          key={form.key(`variations.${index}.price`)}
          {...form.getInputProps(`variations.${index}.price`)}
          withAsterisk
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 2 }} mb="md">
        <NumberInput
          label="Estoque"
          key={form.key(`variations.${index}.initialStock`)}
          {...form.getInputProps(`variations.${index}.initialStock`)}
          withAsterisk
        />
        <Flex gap="md" align="flex-end">
          <TextInput
            label="SKU"
            disabled
            placeholder="Ex: CAM001"
            key={form.key(`variations.${index}.sku`)}
            {...form.getInputProps(`variations.${index}.sku`)}
            withAsterisk
            style={{ flex: 1 }}
          />
          <Button
            disabled
            // onClick={generateSKU}
            variant="outline"
            style={{ marginBottom: "1px" }}
          >
            Gerar
          </Button>
        </Flex>
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
