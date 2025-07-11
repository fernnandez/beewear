import { ConfirmationModal } from "@components/shared/ConfirmationModal/ConfirmationModal";
import {
  Button,
  Card,
  Divider,
  Flex,
  Group,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { fetchCollections } from "@services/collection.service";
import { createProduct } from "@services/product.service";
import { IconGavel, IconPackage } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ProductFormValues } from "src/types/product";
import { ProductVariationActions } from "./ProductVariationActions";
import { ProductVariationForm } from "./ProductVariationForm";

export function NewProductForm() {
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [pendingAction, setPendingAction] = useState<() => void>(
    () => () => {}
  );

  const { data: collections = [], isLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: fetchCollections,
  });

  const form = useForm<ProductFormValues>({
    initialValues: {
      name: "",
      collectionPublicId: "",
      active: false,
      variations: [{ name: "", color: "", imageFiles: [], price: 0 }],
    },
    validate: {
      name: (value) => (value ? null : "Nome é obrigatório"),
      collectionPublicId: (value) => (value ? null : "Coleção obrigatória"),
    },
  });

  const hasOneVariation = form.values.variations.length === 1;

  const addVariation = () => {
    form.insertListItem("variations", {
      name: "",
      color: "",
      price: 0,
      imageFiles: [],
    });
  };

  const removeVariation = (index: number) => {
    form.removeListItem("variations", index);
    if (form.values.variations.length === 0) addVariation();
  };

  const cleanAllVariations = () => {
    form.setFieldValue("variations", []);
    addVariation();
  };

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
    if (form.values.variations.some((v) => !v.color || !v.name)) {
      notifications.show({
        title: "Erro nas variações",
        message: "Todas variações devem ter cor e nome.",
        color: "red",
      });
      return;
    }
    await createProduct(form.values);
    notifications.show({
      title: "Produto criado",
      message: `Produto "${form.values.name}" salvo.`,
      color: "green",
    });
    form.reset();
  };

  const collectionOptions = collections.map((col) => ({
    value: col.publicId,
    label: col.name,
  }));

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Flex direction="column" gap="lg">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section withBorder inheritPadding py="xs" mb="md">
              <Group>
                <IconPackage size={18} />
                <Title order={4}>Informações Básicas</Title>
              </Group>
              <Text size="sm" c="dimmed">
                Preencha os dados principais do produto
              </Text>
            </Card.Section>

            <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
              <TextInput
                label="Nome do Produto"
                placeholder="Ex: Camiseta Básica"
                {...form.getInputProps("name")}
                withAsterisk
              />
              <Select
                label="Coleção"
                placeholder="Selecione..."
                data={collectionOptions}
                clearable
                {...form.getInputProps("collectionPublicId")}
                withAsterisk
                disabled={isLoading}
              />
              <Stack gap={4} justify="center">
                <Text size="sm" fw={500}>
                  Produto ativo
                </Text>
                <Switch
                  {...form.getInputProps("active", { type: "checkbox" })}
                />
              </Stack>
            </SimpleGrid>

            <Card.Section withBorder inheritPadding py="xs" mb="md">
              <Group>
                <IconPackage size={18} />
                <Title order={4}>
                  Variações ({form.values.variations.length})
                </Title>
              </Group>
            </Card.Section>

            <ScrollArea h={350}>
              {form.values.variations.map((_, index) => (
                <ProductVariationForm
                  key={index}
                  index={index}
                  form={form}
                  disableRemove={hasOneVariation}
                  onRemove={() => {
                    setPendingAction(() => () => removeVariation(index));
                    openModal();
                  }}
                />
              ))}
              <Divider />
              <ProductVariationActions
                onAdd={addVariation}
                onClean={() => {
                  setPendingAction(() => cleanAllVariations);
                  openModal();
                }}
                disableClean={hasOneVariation}
              />
            </ScrollArea>
          </Card>

          <Group mb="md" justify="right">
            <Button leftSection={<IconGavel size={16} />} type="submit">
              Salvar Produto
            </Button>
          </Group>
        </Flex>
      </form>

      <ConfirmationModal
        opened={modalOpened}
        onClose={closeModal}
        onConfirm={() => {
          pendingAction();
          closeModal();
        }}
        title="Confirmação"
        iconColor="var(--mantine-color-red-6)"
        headerText="Remover variação?"
        message="Deseja realmente remover esta variação?"
        confirmLabel="Sim, remover"
        cancelLabel="Cancelar"
        confirmColor="red"
      />
    </>
  );
}
