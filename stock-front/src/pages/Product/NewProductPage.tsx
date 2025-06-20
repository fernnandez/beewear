import { AppShellLayout } from "@components/AppShell";
import { ConfirmationModal } from "@components/ConfirmationModal";
import {
  Button,
  Card,
  ColorInput,
  Container,
  Divider,
  Flex,
  Group,
  NumberInput,
  ScrollArea,
  Select,
  SimpleGrid,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { createProduct } from "@services/product.service";
import {
  IconArrowBackUp,
  IconGavel,
  IconPackage,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const collections = [{ value: "1", label: "PADRÃO" }];
const sizes = ["PP", "P", "M", "G", "GG"];

export default function NewProductPage() {
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [pendingAction, setPendingAction] = useState<() => void>(() => {});

  const form = useForm({
    initialValues: {
      name: "",
      collectionId: "",
      variations: [
        {
          color: "",
          size: "",
          // sku: "",
          price: 0,
          initialStock: 0,
        },
      ],
    },

    validate: {
      name: (value) => (value ? null : "Nome é obrigatório"),
      collectionId: (value) => (value ? null : "Coleção é obrigatória"),
    },
  });

  const hasOneVariation = form.getValues().variations.length === 1;

  // const generateSKU = () => {
  //   const category = form.values.category;
  //   if (!category) {
  //     notifications.show({
  //       title: "Atenção",
  //       message: "Selecione uma categoria para gerar o SKU",
  //       color: "yellow",
  //     });
  //     return;
  //   }

  //   const categoryCode = category.substring(0, 3).toUpperCase();
  //   const randomNum = Math.floor(Math.random() * 1000)
  //     .toString()
  //     .padStart(3, "0");
  //   form.setFieldValue("sku", `${categoryCode}${randomNum}`);
  // };

  const addVariation = () => {
    form.insertListItem("variations", {
      color: "",
      size: "",
      price: 0,
      initialStock: 0,
    });
  };

  const removeVariation = (index: number) => {
    form.removeListItem("variations", index);

    if (form.getValues().variations.length === 0) {
      addVariation();
    }
  };

  const cleanAllVariations = () => {
    form.setFieldValue("variations", []);
    addVariation();
  };

  const handleSubmit = async () => {
    const isValid = form.validate();

    if (isValid.hasErrors) {
      console.warn("Formulário com erros:", isValid.errors);
      notifications.show({
        title: "Erro no formulário",
        message: "Por favor, preencha todos os campos obrigatórios.",
        color: "red",
      });
      return;
    }

    const { name, variations } = form.values;

    // Verificações manuais (exemplo de reforço ou validações específicas)
    if (
      variations.length === 0 ||
      variations.some((v) => !v.color || !v.size)
    ) {
      notifications.show({
        title: "Erro nas variações",
        message: "Todas as variações devem ter cor, tamanho e SKU preenchidos.",
        color: "red",
      });
      return;
    }

    await createProduct(form.values);

    console.log("Dados do formulário:", {
      ...form.values,
    });

    notifications.show({
      title: "Produto válido",
      message: `O produto "${name}" foi preenchido corretamente.`,
      color: "green",
    });

    form.reset();

    // Aqui você pode chamar o backend ou redirecionar
    // navigate("/products");
  };

  return (
    <AppShellLayout>
      <Container size="xl">
        <Group justify="space-between" mb="xl">
          <div>
            <Title order={2} mb="md">
              Novo Produto
            </Title>
            <Text c="dimmed">Crie uma novo produto</Text>
          </div>
          <Button
            variant="light"
            component={Link}
            to="/products"
            leftSection={<IconArrowBackUp size={16} />}
          >
            Produtos
          </Button>
        </Group>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Flex direction="column" gap="lg">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs" mb="md">
                <Group>
                  <IconPackage size={18} />
                  <Title order={4}>Informações Básicas</Title>
                </Group>
                <Text size="sm" c="dimmed">
                  Dados principais do produto
                </Text>
              </Card.Section>

              <SimpleGrid cols={{ base: 1, sm: 2 }} mb="md">
                <TextInput
                  label="Nome do Produto"
                  placeholder="Ex: Camiseta Básica"
                  key={form.key("name")}
                  {...form.getInputProps("name")}
                  withAsterisk
                />

                <Select
                  label="Coleção"
                  placeholder="Selecione..."
                  data={collections}
                  key={form.key("collectionId")}
                  {...form.getInputProps("collectionId")}
                  withAsterisk
                />
              </SimpleGrid>

              <Card.Section withBorder inheritPadding py="xs" mb="md">
                <Group>
                  <IconPackage size={18} />
                  <Title order={4}>Variações de produto</Title>
                </Group>
                <Text size="sm" c="dimmed">
                  {form.values.variations.length}{" "}
                  {hasOneVariation ? "variação" : "variações"}
                </Text>
              </Card.Section>

              <ScrollArea h={350}>
                {form.values.variations.map((_, index) => (
                  <Card key={index} withBorder padding="md" mb="md">
                    <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
                      <ColorInput
                        label="Cor"
                        key={form.key(`variations.${index}.color`)}
                        {...form.getInputProps(`variations.${index}.color`)}
                        withAsterisk
                        rightSection
                      />
                      <Select
                        label="Tamanho"
                        data={sizes}
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
                        {...form.getInputProps(
                          `variations.${index}.initialStock`
                        )}
                        withAsterisk
                      />
                      <Flex gap="md" align="flex-end">
                        <TextInput
                          disabled
                          label="SKU"
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
                      disabled={hasOneVariation}
                      onClick={() => {
                        setPendingAction(() => () => removeVariation(index));
                        openModal();
                      }}
                      variant="subtle"
                      px={4}
                    >
                      <IconTrash size={18} />
                    </Button>
                  </Card>
                ))}
                <Divider />
                <Flex justify="center" gap="md" mb="md" mt="md">
                  <Button
                    color="red"
                    onClick={() => {
                      setPendingAction(() => cleanAllVariations);
                      openModal();
                    }}
                    variant="outline"
                    leftSection={<IconTrash size={16} />}
                    fullWidth
                    style={{ flex: 1 }}
                    disabled={hasOneVariation}
                  >
                    Limpar Variações
                  </Button>
                  <Button
                    onClick={addVariation}
                    variant="outline"
                    leftSection={<IconPlus size={16} />}
                    fullWidth
                    style={{ flex: 1 }}
                  >
                    Adicionar Variação
                  </Button>
                </Flex>
              </ScrollArea>
            </Card>

            <Group justify="flex-end" mb="md">
              <Button leftSection={<IconGavel size={16} />} type="submit">
                Salvar Produto
              </Button>
            </Group>
          </Flex>
        </form>
      </Container>

      <ConfirmationModal
        opened={modalOpened}
        onClose={closeModal}
        onConfirm={() => {
          pendingAction();
          closeModal();
        }}
        title="Tem certeza?"
        message="Essa ação não pode ser desfeita."
        confirmLabel="Sim, remover"
        cancelLabel="Cancelar"
      />
    </AppShellLayout>
  );
}
