import {
  Button,
  Grid,
  Modal,
  Stack,
  TextInput,
  Title,
  useMantineColorScheme,
  useMantineTheme,
  Checkbox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconHome,
  IconMapPin,
  IconBuilding,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import { useState } from "react";

interface AddressFormData {
  name: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface AddressModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: (address: AddressFormData) => void;
  initialData?: Partial<AddressFormData>;
  isEditing?: boolean;
}

export const AddressModal = ({ 
  opened, 
  onClose, 
  onSave, 
  initialData,
  isEditing = false 
}: AddressModalProps) => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const isDark = colorScheme === "dark";
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddressFormData>({
    initialValues: {
      name: initialData?.name || "",
      street: initialData?.street || "",
      number: initialData?.number || "",
      complement: initialData?.complement || "",
      neighborhood: initialData?.neighborhood || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      postalCode: initialData?.postalCode || "",
      country: initialData?.country || "Portugal",
      isDefault: initialData?.isDefault || false,
    },
    validate: {
      name: (value) => (value.trim().length === 0 ? "Nome é obrigatório" : null),
      street: (value) => (value.trim().length === 0 ? "Rua é obrigatória" : null),
      number: (value) => (value.trim().length === 0 ? "Número é obrigatório" : null),
      neighborhood: (value) => (value.trim().length === 0 ? "Bairro é obrigatório" : null),
      city: (value) => (value.trim().length === 0 ? "Cidade é obrigatória" : null),
      state: (value) => (value.trim().length === 0 ? "Estado é obrigatório" : null),
      postalCode: (value) => (value.trim().length === 0 ? "CEP é obrigatório" : null),
      country: (value) => (value.trim().length === 0 ? "País é obrigatório" : null),
    },
  });

  const handleSubmit = async () => {
    if (!form.validate().hasErrors) {
      setIsLoading(true);
      try {
        await onSave(form.values);
        
        notifications.show({
          title: isEditing ? "Endereço atualizado" : "Endereço cadastrado",
          message: isEditing 
            ? "Endereço atualizado com sucesso" 
            : "Endereço cadastrado com sucesso",
          color: "green",
        });
        
        onClose();
        form.reset();
      } catch (error) {
        notifications.show({
          title: "Erro",
          message: "Erro ao salvar endereço. Tente novamente.",
          color: "red",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal 
      opened={opened} 
      onClose={handleClose} 
      title={isEditing ? "Editar Endereço" : "Novo Endereço"}
      size="md" 
      centered
      radius="md"
      styles={{
        header: {
          borderBottom: "1px solid #e9ecef",
        },
        title: {
          fontSize: "1.25rem",
          fontWeight: 700,
        },
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {/* Nome do Endereço */}
          <TextInput
            label="Nome do Endereço"
            placeholder="Ex: Casa, Trabalho, etc."
            leftSection={<IconHome size={16} />}
            withAsterisk
            {...form.getInputProps("name")}
          />

          {/* Rua e Número */}
          <Grid>
            <Grid.Col span={8}>
              <TextInput
                label="Rua"
                placeholder="Nome da rua"
                leftSection={<IconMapPin size={16} />}
                withAsterisk
                {...form.getInputProps("street")}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="Número"
                placeholder="123"
                withAsterisk
                {...form.getInputProps("number")}
              />
            </Grid.Col>
          </Grid>

          {/* Complemento */}
          <TextInput
            label="Complemento"
            placeholder="Apartamento, bloco, etc. (opcional)"
            leftSection={<IconBuilding size={16} />}
            {...form.getInputProps("complement")}
          />

          {/* Bairro */}
          <TextInput
            label="Bairro"
            placeholder="Nome do bairro"
            withAsterisk
            {...form.getInputProps("neighborhood")}
          />

          {/* Cidade e Estado */}
          <Grid>
            <Grid.Col span={8}>
              <TextInput
                label="Cidade"
                placeholder="Nome da cidade"
                withAsterisk
                {...form.getInputProps("city")}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="Estado"
                placeholder="Estado"
                withAsterisk
                {...form.getInputProps("state")}
              />
            </Grid.Col>
          </Grid>

          {/* CEP e País */}
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="CEP"
                placeholder="00000-000"
                withAsterisk
                {...form.getInputProps("postalCode")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="País"
                placeholder="País"
                withAsterisk
                {...form.getInputProps("country")}
              />
            </Grid.Col>
          </Grid>

          {/* Endereço Padrão */}
          <Checkbox
            label="Definir como endereço padrão"
            {...form.getInputProps("isDefault", { type: "checkbox" })}
          />

          {/* Botões */}
          <Stack gap="sm" mt="md">
            <Button
              type="submit"
              loading={isLoading}
              fullWidth
              style={{
                backgroundColor: isDark ? theme.colors.yellow[6] : undefined,
                color: isDark ? theme.black : undefined,
              }}
            >
              {isLoading 
                ? (isEditing ? "Atualizando..." : "Salvando...") 
                : (isEditing ? "Atualizar Endereço" : "Salvar Endereço")
              }
            </Button>
            
            <Button
              variant="outline"
              onClick={handleClose}
              fullWidth
            >
              Cancelar
            </Button>
          </Stack>
        </Stack>
      </form>
    </Modal>
  );
}; 