import { Modal } from "@mantine/core";
import { NewVariationForm } from "../forms/NewVariationForm";

interface EditImagesModalProps {
  opened: boolean;
  onClose: () => void;
}

export function NewVariationModal({ opened, onClose }: EditImagesModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Adicionar Nova variação`}
      size="lg"
    >
      <NewVariationForm />
    </Modal>
  );
}
