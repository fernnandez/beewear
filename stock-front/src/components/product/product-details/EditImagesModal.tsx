import {
  Button,
  CloseButton,
  FileInput,
  Group,
  Modal,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { IconDeviceFloppy, IconUpload } from "@tabler/icons-react";

interface EditImagesModalProps {
  opened: boolean;
  onClose: () => void;
  editingVariation: any | null;
  newImages: File[];
  setNewImages: (files: File[]) => void;
  handleRemoveImage: (variationId: string, imageIndex: number) => void;
  handleSaveImages: () => void;
  getColorName: (color: string) => string;
}

export function EditImagesModal({
  opened,
  onClose,
  editingVariation,
  newImages,
  setNewImages,
  handleRemoveImage,
  handleSaveImages,
  getColorName,
}: EditImagesModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Gerenciar Imagens - ${
        editingVariation ? getColorName(editingVariation.color) : ""
      }`}
      size="lg"
    >
      <Stack>
        {/* Imagens Atuais */}
        {editingVariation?.images && editingVariation.images.length > 0 && (
          <div>
            <Text mb="xs">
              Imagens Atuais ({editingVariation.images.length})
            </Text>
            <SimpleGrid cols={3} spacing="xs" mb="md">
              {editingVariation.images.map((image: string, index: number) => (
                <Paper key={index} pos="relative" withBorder>
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Imagem ${index + 1}`}
                    style={{
                      borderRadius: 8,
                      width: "100%",
                      height: 100,
                      objectFit: "cover",
                    }}
                  />
                  <CloseButton
                    pos="absolute"
                    top={4}
                    right={4}
                    size="sm"
                    bg="rgba(0,0,0,0.7)"
                    c="white"
                    onClick={() =>
                      handleRemoveImage(editingVariation.publicId, index)
                    }
                  />
                </Paper>
              ))}
            </SimpleGrid>
          </div>
        )}

        {/* Adicionar Novas Imagens */}
        <div>
          <Text mb="xs">Adicionar Novas Imagens</Text>
          <FileInput
            placeholder="Selecionar imagens"
            accept="image/*"
            multiple
            leftSection={<IconUpload size={16} />}
            value={newImages}
            onChange={(files) => setNewImages(files || [])}
          />

          {newImages.length > 0 && (
            <Paper p="md" withBorder bg="var(--mantine-color-blue-0)" mt="xs">
              <Text size="sm" color="blue" mb="xs">
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
  );
}
