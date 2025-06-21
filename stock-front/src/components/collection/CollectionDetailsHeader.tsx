// CollectionHeader.tsx
import { Button, Group, Text, Title } from "@mantine/core";
import { IconDeviceFloppy, IconEdit } from "@tabler/icons-react";

export function CollectionDetailsHeader({
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onBack,
}: {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onBack: () => void;
}) {
  return (
    <Group justify="space-between" mb="xl">
      <div>
        <Button variant="subtle" onClick={onBack}>
          ← Voltar
        </Button>
        <Title order={2}>
          {isEditing ? "Editando Coleção" : "Detalhes da Coleção"}
        </Title>
        <Text c="dimmed">
          {isEditing
            ? "Modifique as informações da coleção"
            : "Visualize e gerencie sua coleção"}
        </Text>
      </div>

      <Group>
        {!isEditing ? (
          <Button
            variant="outline"
            leftSection={<IconEdit size={16} />}
            onClick={onEdit}
          >
            Editar
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button
              leftSection={<IconDeviceFloppy size={16} />}
              onClick={onSave}
            >
              Salvar
            </Button>
          </>
        )}
      </Group>
    </Group>
  );
}
