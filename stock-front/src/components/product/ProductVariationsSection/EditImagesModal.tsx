import { ImagePreview } from "@components/shared/ImagePreview/ImagePreview";
import {
  Button,
  Center,
  Divider,
  FileInput,
  Group,
  Modal,
  Paper,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  addVariationImages,
  removeVariationImage,
} from "@services/productVariaton.service";
import { IconDeviceFloppy, IconUpload } from "@tabler/icons-react";
import { getAxiosErrorMessage } from "@utils/getAxiosErrorMessage";
import { queryClient } from "@utils/queryClient";
import { useState } from "react";
import { Variation } from "./ProductVariationsSection";

interface EditImagesModalProps {
  opened: boolean;
  onClose: () => void;
  variation: Variation;
  productPublicId: string;
}

export function EditImagesModal({
  opened,
  onClose,
  variation,
  productPublicId,
}: EditImagesModalProps) {
  const [newImages, setNewImages] = useState<File[]>([]);
  const [confirmDeleteImage, setConfirmDeleteImage] = useState<string | null>(
    null
  );

  const handleRemoveImage = async () => {
    if (!confirmDeleteImage) return;

    try {
      await removeVariationImage(variation.publicId, confirmDeleteImage);
      notifications.show({
        title: "Imagem removida",
        message: `Imagem removida com sucesso.`,
        color: "green",
      });
      queryClient.invalidateQueries({
        queryKey: ["product-details", productPublicId],
      });
      queryClient.invalidateQueries({
        queryKey: ["image", confirmDeleteImage],
      });
    } catch (error) {
      notifications.show({
        title: "Erro",
        message: getAxiosErrorMessage(
          error,
          "Erro desconhecido ao remover imagem."
        ),
        color: "red",
      });
    } finally {
      setConfirmDeleteImage(null); // fecha o modal de confirmação
    }
  };

  const handleSaveImages = async () => {
    try {
      await addVariationImages(variation.publicId, newImages);
      notifications.show({
        title: "Imagens adicionadas",
        message: `Imagens adicionadas com sucesso.`,
        color: "green",
      });
      setNewImages([]);
      await queryClient.invalidateQueries({
        queryKey: ["product-details", productPublicId],
      });
    } catch (error) {
      notifications.show({
        title: "Erro",
        message: getAxiosErrorMessage(
          error,
          "Erro desconhecido ao adicionar imagens."
        ),
        color: "red",
      });
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title={`Gerenciar Imagens - ${variation.name}`}
        size="xl"
      >
        <Stack>
          {variation?.images && variation.images.length > 0 && (
            <Group gap="xs" mb="md" align="center" justify="center">
              {variation.images.map((image: string, index: number) => (
                <Paper key={index} withBorder maw={150}>
                  <Stack>
                    <Button
                      size="xs"
                      color="red"
                      variant="outline"
                      onClick={() => setConfirmDeleteImage(image)}
                    >
                      Remover imagem
                    </Button>
                    <ImagePreview image={image} miw={150} maw={150} />
                  </Stack>
                </Paper>
              ))}
            </Group>
          )}

          <Divider />

          <div>
            <Text mb="xs">Adicionar Novas Imagens</Text>
            <FileInput
              placeholder="Selecionar imagens"
              accept="image/*"
              multiple
              leftSection={<IconUpload size={16} />}
              value={newImages}
              onChange={(files) => setNewImages(files || [])}
              clearable
            />

            {newImages.length > 0 && (
              <Paper p="md" withBorder bg="var(--mantine-color-blue-0)" mt="xs">
                <Text size="sm" c="blue" mb="xs">
                  {newImages.length} nova(s) imagem(ns) para adicionar
                </Text>
                <ScrollArea>
                  <Group gap="xs">
                    {newImages.map((file, index) => (
                      <Paper
                        key={index}
                        p="xs"
                        withBorder
                        bg="white"
                        style={{ minWidth: 120 }}
                      >
                        <Text size="xs" truncate>
                          {file.name}
                        </Text>
                      </Paper>
                    ))}
                  </Group>
                </ScrollArea>
              </Paper>
            )}
          </div>

          <Group align="right" mt="md">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              leftSection={<IconDeviceFloppy size={16} />}
              onClick={handleSaveImages}
              disabled={newImages.length === 0}
            >
              Salvar Imagens
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Modal de confirmação de remoção */}
      <Modal
        opened={confirmDeleteImage !== null}
        onClose={() => setConfirmDeleteImage(null)}
        title="Confirmar remoção"
        centered
        withCloseButton={false}
      >
        <Stack>
          <Text>Tem certeza que deseja remover esta imagem?</Text>
          <Center>
            <ImagePreview
              image={confirmDeleteImage ?? ""}
              miw={150}
              maw={150}
            />
          </Center>
          <Group justify="flex-end" mt="sm">
            <Button
              variant="default"
              onClick={() => setConfirmDeleteImage(null)}
            >
              Cancelar
            </Button>
            <Button color="red" onClick={handleRemoveImage}>
              Remover
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
