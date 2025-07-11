import { ConfirmationModal } from "@components/shared/ConfirmationModal/ConfirmationModal";
import { ProductVariationSize } from "@localTypes/product";
import {
  Accordion,
  ActionIcon,
  Box,
  Card,
  Group,
  Menu,
  Table,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { deleteProductVariation } from "@services/productVariaton.service";
import {
  IconDotsVertical,
  IconEdit,
  IconPhoto,
  IconTrash,
} from "@tabler/icons-react";
import { getAxiosErrorMessage } from "@utils/getAxiosErrorMessage";
import { queryClient } from "@utils/queryClient";
import { EditImagesModal } from "./EditImagesModal";
import { EditVariationModal } from "./EditVariationModal";
import { ProductVariationSizeLine } from "./ProductVariationSizeLine";

interface Variation {
  publicId: string;
  name: string;
  color: string;
  price: number;
  sizes: ProductVariationSize[];
  images?: string[] | null;
}

export function ProductVariationSectionCard({
  productPublicId,
  variation,
}: {
  productPublicId: string;
  variation: Variation;
}) {
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [
    imagesModalOpened,
    { open: openImagesModal, close: closeImagesModal },
  ] = useDisclosure(false);

  const handleDeleteVariation = async (publicId: string) => {
    try {
      await deleteProductVariation(publicId);
      notifications.show({
        title: "Variação removida",
        message: `Variação "${variation.name}" removida.`,
        color: "green",
      });
      closeDeleteModal();
      queryClient.invalidateQueries({
        queryKey: ["product-details", productPublicId],
      });
    } catch (error) {
      notifications.show({
        title: "Erro",
        message: getAxiosErrorMessage(
          error,
          "Erro desconhecido ao remover variação."
        ),
        color: "red",
      });
    }
  };

  return (
    <>
      <Card key={variation.publicId} withBorder>
        <Group justify="space-between" mb="md" align="center">
          <Group>
            <Box
              w={32}
              h={32}
              style={{
                backgroundColor: variation.color,
                borderRadius: "50%",
                border: "2px solid var(--mantine-color-gray-3)",
              }}
            />
            <div>
              <Text fw={500}>{variation.name}</Text>
              <Text size="sm" c="dimmed">
                R$ {variation.price.toFixed(2).replace(".", ",")} •{" "}
                {variation.sizes.length} tamanhos •{" "}
                {variation.images?.length || 0} imagens
              </Text>
            </div>
          </Group>

          <Menu position="bottom-end" withArrow>
            <Menu.Target>
              <ActionIcon variant="subtle" size="sm">
                <IconDotsVertical size={14} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEdit size={12} />}
                onClick={() => {
                  openEditModal();
                }}
              >
                Editar Variação
              </Menu.Item>
              <Menu.Item
                leftSection={<IconPhoto size={12} />}
                onClick={() => {
                  openImagesModal();
                }}
              >
                Gerenciar Imagens
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconTrash size={12} />}
                color="red"
                onClick={() => {
                  openDeleteModal();
                }}
              >
                Excluir Variação
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        <Accordion variant="separated">
          <Accordion.Item value={`sizes-${variation.publicId}`}>
            <Accordion.Control>
              Tamanhos e Estoque ({variation.sizes.length})
            </Accordion.Control>
            <Accordion.Panel>
              <Table highlightOnHover verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Tamanho</Table.Th>
                    <Table.Th>Estoque</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Ações</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {variation.sizes.map((sizeOption) => (
                    <ProductVariationSizeLine
                      key={sizeOption.stock.publicId}
                      size={sizeOption}
                      productPublicId={productPublicId}
                      variationColor={variation.color}
                      variationName={variation.name}
                    />
                  ))}
                </Table.Tbody>
              </Table>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Card>

      <EditVariationModal
        opened={editModalOpened}
        onClose={closeEditModal}
        productPublicId={productPublicId}
        variation={variation}
      />

      <EditImagesModal
        opened={imagesModalOpened}
        onClose={closeImagesModal}
        variation={variation}
        productPublicId={productPublicId}
      />

      <ConfirmationModal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        onConfirm={() => {
          handleDeleteVariation(variation.publicId);
          closeDeleteModal();
        }}
        title="Confirmação"
        confirmLabel="Sim, remover"
        iconColor="var(--mantine-color-red-6)"
        headerText="Remover variação?"
        headerSubtext={"Deseja realmente remover esta variação?"}
        message="Ao fazer isso as imagens relacionadas e o estoque também serão removidos."
        cancelLabel="Cancelar"
        confirmColor="red"
      />
    </>
  );
}
