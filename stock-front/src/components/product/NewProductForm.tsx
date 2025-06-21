import { ConfirmationModal } from "@components/ConfirmationModal";
import {
  Button,
  Card,
  Divider,
  Flex,
  Group,
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
import { IconGavel, IconPackage } from "@tabler/icons-react";
import { useState } from "react";
import { VariationActions } from "./ProductVariationActions";
import { ProductVariationCard } from "./ProductVariationCard";
import type { ProductFormValues } from "./types";

const collections = [{ value: "1", label: "PADRÃO" }];

export function NewProductForm() {
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [pendingAction, setPendingAction] = useState<() => void>(() => {});

  const form = useForm<ProductFormValues>({
    initialValues: {
      name: "",
      collectionId: "",
      variations: [
        {
          color: "",
          size: "",
          price: 0,
          initialStock: 0,
          sku: "",
        },
      ],
    },
    validate: {
      name: (value) => (value ? null : "Nome é obrigatório"),
      collectionId: (value) => (value ? null : "Coleção é obrigatória"),
    },
  });

  const hasOneVariation = form.values.variations.length === 1;

  const addVariation = () => {
    form.insertListItem("variations", {
      color: "",
      size: "",
      price: 0,
      initialStock: 0,
      sku: "",
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
    const isValid = form.validate();

    if (isValid.hasErrors) {
      notifications.show({
        title: "Erro no formulário",
        message: "Preencha todos os campos obrigatórios.",
        color: "red",
      });
      return;
    }

    if (
      form.values.variations.length === 0 ||
      form.values.variations.some((v) => !v.color || !v.size)
    ) {
      notifications.show({
        title: "Erro nas variações",
        message: "Todas as variações devem ter cor, tamanho e preço.",
        color: "red",
      });
      return;
    }

    await createProduct(form.values);

    notifications.show({
      title: "Produto criado",
      message: `O produto "${form.values.name}" foi salvo com sucesso.`,
      color: "green",
    });

    form.reset();
  };

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
                <Title order={4}>Variações</Title>
              </Group>
              <Text size="sm" c="dimmed">
                {form.values.variations.length}{" "}
                {hasOneVariation ? "variação" : "variações"}
              </Text>
            </Card.Section>

            <ScrollArea h={350}>
              {form.values.variations.map((_, index) => (
                <ProductVariationCard
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
              <VariationActions
                onAdd={addVariation}
                onClean={() => {
                  setPendingAction(() => cleanAllVariations);
                  openModal();
                }}
                disableClean={hasOneVariation}
              />
            </ScrollArea>
          </Card>

          <Group justify="flex-end" mb="md">
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
        title="Tem certeza?"
        message="Essa ação não pode ser desfeita."
        confirmLabel="Sim, remover"
        cancelLabel="Cancelar"
      />
    </>
  );
}
