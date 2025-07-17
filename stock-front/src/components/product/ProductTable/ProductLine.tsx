import { ConfirmationModal } from "@components/shared/ConfirmationModal/ConfirmationModal";
import { Product, ProductVariation } from "@localTypes/product";
import {
  ActionIcon,
  Avatar,
  Badge,
  Group,
  Menu,
  Table,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { deleteProduct } from "@services/product.service";
import { IconDotsVertical, IconEye, IconTrash } from "@tabler/icons-react";
import { getAxiosErrorMessage } from "@utils/getAxiosErrorMessage";
import { queryClient } from "@utils/queryClient";
import { useNavigate } from "react-router-dom";

export const ProductLine = ({ product }: { product: Product }) => {
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const handleDeleteProduct = async (publicId: string) => {
    try {
      await deleteProduct(publicId);
      notifications.show({
        title: "Produto removido",
        message: `Produto removido.`,
        color: "green",
      });
      closeDeleteModal();
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      notifications.show({
        title: "Erro",
        message: getAxiosErrorMessage(
          error,
          "Erro desconhecido ao remover o produto."
        ),
        color: "red",
      });
    }
  };

  const getPriceRange = (variations: ProductVariation[]) => {
    if (variations.length === 0) return { min: 0, max: 0 };

    const prices = variations.map((v) => Number.parseFloat(v.price.toString()));
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return { min, max };
  };

  const priceRange = getPriceRange(product.variations);

  const navigate = useNavigate();
  return (
    <>
      <Table.Tr key={product.publicId}>
        <Table.Td>
          <Group>
            <Avatar color="yellow" radius="sm" size="md">
              {product.name.charAt(0)}
            </Avatar>
            <div>
              <Text fw={500}>{product.name}</Text>
              <Text size="sm" c="dimmed">
                ID: {product.publicId.slice(0, 8)}...
              </Text>
            </div>
          </Group>
        </Table.Td>

        <Table.Td>
          <Badge
            variant="light"
            color={product.collection.active ? "yellow" : "gray"}
            size="sm"
          >
            {product.collection.name}
          </Badge>
        </Table.Td>

        <Table.Td>
          <Group gap="xs">
            <Text fw={500}>{product.variations.length}</Text>
            <Group gap={4}>
              {product.variations.slice(0, 3).map((variation) => (
                <div
                  key={variation.publicId}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: variation.color,
                    border: "1px solid #e0e0e0",
                  }}
                  title={variation.name}
                />
              ))}
              {product.variations.length > 3 && (
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #e0e0e0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text size="xs" c="dimmed">
                    +
                  </Text>
                </div>
              )}
            </Group>
          </Group>
        </Table.Td>

        <Table.Td>
          <Text fw={500}>
            {priceRange.min === priceRange.max
              ? `R$ ${priceRange.min.toFixed(2)}`
              : `R$ ${priceRange.min.toFixed(2)} - R$ ${priceRange.max.toFixed(
                  2
                )}`}
          </Text>
        </Table.Td>

        <Table.Td>
          <Badge color={product.active ? "green" : "gray"} size="sm">
            {product.active ? "Ativo" : "Inativo"}
          </Badge>
        </Table.Td>

        <Table.Td>
          <Menu position="bottom-end" withArrow>
            <Menu.Target>
              <ActionIcon variant="subtle">
                <IconDotsVertical size={20} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEye size={14} />}
                onClick={() => navigate(`/products/${product.publicId}`)}
              >
                Ver Detalhes
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconTrash size={14} />}
                color="red"
                onClick={openDeleteModal}
              >
                Excluir
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Table.Td>
      </Table.Tr>
      <ConfirmationModal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        onConfirm={() => {
          handleDeleteProduct(product.publicId);
          closeDeleteModal();
        }}
        title="Confirmação"
        confirmLabel="Sim, remover"
        iconColor="var(--mantine-color-red-6)"
        headerText="Remover produto?"
        headerSubtext={"Deseja realmente remover este produto?"}
        message="Ao fazer isso as variações, imagens relacionadas e o estoque também serão removidos."
        cancelLabel="Cancelar"
        confirmColor="red"
      />
    </>
  );
};
