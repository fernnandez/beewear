import { ImagePreview } from "@components/shared/ImagePreview/ImagePreview";
import {
  Badge,
  Button,
  Center,
  Divider,
  FileInput,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { updateCollectionImage } from "@services/collection.service";
import { IconDeviceFloppy, IconPhoto, IconUpload } from "@tabler/icons-react";
import { getAxiosErrorMessage } from "@utils/getAxiosErrorMessage";
import { queryClient } from "@utils/queryClient";
import { useState } from "react";

interface EditImageModalProps {
  opened: boolean;
  onClose: () => void;
  collectionName: string;
  imageUrl?: string | null;
  collectionPublicId: string;
}

export function EditImageModal({
  opened,
  onClose,
  collectionName,
  imageUrl,
  collectionPublicId,
}: EditImageModalProps) {
  const [newImage, setNewImage] = useState<File | null>(null);

  const handleSaveImage = async () => {
    try {
      if (!newImage) {
        notifications.show({
          title: "Erro",
          message: "Nenhuma imagem selecionada",
          color: "red",
        });
        return;
      }

      await updateCollectionImage(collectionPublicId, newImage);

      queryClient.invalidateQueries({
        queryKey: ["collection-details", collectionPublicId],
      });

      notifications.show({
        title: "Imagem atualizada",
        message: `Imagem atualizada com sucesso.`,
        color: "green",
      });

      setNewImage(null);
      onClose();
    } catch (error) {
      notifications.show({
        title: "Erro",
        message: getAxiosErrorMessage(
          error,
          "Erro desconhecido ao adicionar imagem."
        ),
        color: "red",
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Gerenciar Imagem - ${collectionName}`}
      size="xl"
    >
      <Stack>
        {imageUrl ? (
          <Center>
            <ImagePreview
              image={imageUrl}
              key={collectionPublicId}
              miw={600}
              maw={600}
            />
          </Center>
        ) : (
          <>
            <IconPhoto size={32} color="var(--mantine-color-blue-6)" />
            <Badge variant="light" color="blue" size="sm">
              Nenhuma imagem
            </Badge>
          </>
        )}

        <Divider />

        <div>
          <Text mb="xs">Adicionar Nova Imagem</Text>
          <FileInput
            placeholder="Selecionar imagem"
            accept="image/*"
            multiple={false}
            leftSection={<IconUpload size={16} />}
            value={newImage}
            onChange={setNewImage}
            clearable
          />

          {newImage && (
            <Paper p="md" withBorder bg="var(--mantine-color-blue-0)" mt="xs">
              <Text size="sm" c="blue" mb="xs">
                Imagem selecionada
              </Text>
              <Paper p="xs" withBorder bg="white" style={{ minWidth: 120 }}>
                <Text size="xs" truncate>
                  {newImage.name}
                </Text>
              </Paper>
            </Paper>
          )}
        </div>

        <Group align="right" mt="md">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            leftSection={<IconDeviceFloppy size={16} />}
            onClick={handleSaveImage}
            disabled={!newImage}
          >
            Salvar Imagem
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
