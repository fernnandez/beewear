import { useForm } from "@mantine/form";
import {
  TextInput,
  Select,
  NumberInput,
  Button,
  Group,
  Box,
  Stack,
  Card,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";

const sizes = ["PP", "P", "M", "G", "GG"];
const colors = ["Branco", "Preto", "Azul", "Vermelho"];

export const ProductForm = () => {
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      variations: [],
    },
  });

  const addVariant = () => {
    form.insertListItem("variations", {
      color: "",
      size: "",
      sku: "",
      price: 0,
      stock: 0,
    });
  };

  return (
    <Box maw={800} mx="auto">
      <form>
        <Stack>
          <TextInput
            label="Nome do Produto"
            {...form.getInputProps("name")}
            required
          />

          <TextInput label="Descrição" {...form.getInputProps("description")} />

          <Group justify="space-between" mt="md">
            <h4>Variações</h4>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={addVariant}
              variant="outline"
            >
              Adicionar Variação
            </Button>
          </Group>

          {form.values.variations.map((_, index) => (
            <Card key={index} withBorder padding="md">
              <Group grow align="flex-end">
                <Select
                  label="Cor"
                  data={colors}
                  {...form.getInputProps(`variations.${index}.color`)}
                />
                <Select
                  label="Tamanho"
                  data={sizes}
                  {...form.getInputProps(`variations.${index}.size`)}
                />
                <TextInput
                  label="SKU"
                  placeholder="ex: CAM001-PP"
                  {...form.getInputProps(`variations.${index}.sku`)}
                />
                <NumberInput
                  label="Preço"
                  prefix="R$ "
                  {...form.getInputProps(`variations.${index}.price`)}
                />
                <NumberInput
                  label="Estoque"
                  {...form.getInputProps(`variations.${index}.stock`)}
                />
                <Button
                  color="red"
                  onClick={() => form.removeListItem("variations", index)}
                  variant="subtle"
                  px={4}
                >
                  <IconTrash size={18} />
                </Button>
              </Group>
            </Card>
          ))}

          <Group justify="flex-end" mt="xl">
            <Button type="submit">Salvar Produto</Button>
          </Group>
        </Stack>
      </form>
    </Box>
  );
};
