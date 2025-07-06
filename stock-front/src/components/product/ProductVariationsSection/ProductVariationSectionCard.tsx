import { ConfirmationModal } from "@components/shared/ConfirmationModal";
import {
  Accordion,
  ActionIcon,
  Badge,
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

interface Variation {
  publicId: string;
  name: string;
  color: string;
  price: number;
  sizes: SizeOption[];
  images?: string[] | null;
}

interface SizeOption {
  stock: { publicId: string; quantity: number };
  size: string;
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
                    <Table.Tr key={sizeOption.stock.publicId}>
                      <Table.Td>
                        <Badge variant="light" color="gray" size="sm">
                          {sizeOption.size}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={500}>{sizeOption.stock.quantity}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={
                            sizeOption.stock.quantity > 0 ? "green" : "red"
                          }
                          variant="light"
                          size="sm"
                        >
                          {sizeOption.stock.quantity > 0
                            ? "Disponível"
                            : "Sem Estoque"}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <ActionIcon
                          variant="light"
                          color="blue"
                          size="sm"
                          radius="xl"
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
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
