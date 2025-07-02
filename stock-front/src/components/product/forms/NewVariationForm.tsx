import { Size } from "@localTypes/product";
import {
  Card,
  ColorInput,
  MultiSelect,
  NumberInput,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

export interface VariationFormValues {
  name: string;
  color: string;
  sizes: Array<string>;
  price: number;
}

const sizeOption = Object.values(Size).map((size) => ({
  label: size,
  value: size,
}));

export function NewVariationForm() {
  const form = useForm<VariationFormValues>({
    initialValues: {
      name: "",
      color: "",
      sizes: [],
      price: 0,
    },
    validate: {
      name: (value: string) => (value ? null : "Nome é obrigatório"),
      color: (value: string) => (value ? null : "Cor é obrigatória"),
      sizes: (value: Array<string>) =>
        value.length > 0 ? null : "Tamanho é obrigatório",
      price: (value: number) =>
        value > 0 ? null : "Pre o deve ser maior que 0",
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

    // await createVariation(form.values);
    notifications.show({
      title: "Produto criado",
      message: `Produto "${form.values.name}" salvo.`,
      color: "green",
    });
    form.reset();
  };

  return (
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
          <MultiSelect
            label="Tamanhos"
            data={sizeOption}
            clearable
            key={form.key(`sizes`)}
            {...form.getInputProps(`sizes`)}
            withAsterisk
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 2 }} mb="md">
          <NumberInput
            label="Preço"
            prefix="R$ "
            key={form.key(`price`)}
            {...form.getInputProps(`price`)}
            withAsterisk
          />
        </SimpleGrid>
      </Card>
    </form>
  );
}
