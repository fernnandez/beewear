
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Container,
  Group,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
  Modal,
  TextInput,
  Grid,
  ThemeIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import {
  IconArrowLeft,
  IconPlus,
  IconEdit,
  IconTrash,
  IconMapPin,
  IconHome,
  IconBuilding,
  IconRoad,
  IconHash,
  IconMap,
  IconFlag,
  IconMail,
} from "@tabler/icons-react";
import { DARK_COLOR } from "@utils/constants";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Address, CreateOrUpdateAddressDto } from "../../types/address";
import { AddressService } from "../../services/address.service";
import { notifications } from "@mantine/notifications";

export default function Addresses() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [modalOpened, setModalOpened] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);


  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: AddressService.findAll,
  });


  const createAddressMutation = useMutation({
    mutationFn: AddressService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      notifications.show({
        title: "Sucesso",
        message: "Endereço criado com sucesso",
        color: "green",
      });
      closeModal();
    },
    onError: () => {
      notifications.show({
        title: "Erro",
        message: "Não foi possível criar o endereço",
        color: "red",
      });
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateOrUpdateAddressDto }) =>
      AddressService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      notifications.show({
        title: "Sucesso",
        message: "Endereço atualizado com sucesso",
        color: "green",
      });
      closeModal();
    },
    onError: () => {
      notifications.show({
        title: "Erro",
        message: "Não foi possível atualizar o endereço",
        color: "red",
      });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: AddressService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      notifications.show({
        title: "Sucesso",
        message: "Endereço excluído com sucesso",
        color: "green",
      });
    },
    onError: () => {
      notifications.show({
        title: "Erro",
        message: "Não foi possível excluir o endereço",
        color: "red",
      });
    },
  });

  const form = useForm<CreateOrUpdateAddressDto>({
    initialValues: {
      name: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Portugal",
    },
    validate: {
      name: (value) => (value.trim().length < 2 ? "Nome deve ter pelo menos 2 caracteres" : null),
      street: (value) => (value.trim().length < 2 ? "Rua deve ter pelo menos 2 caracteres" : null),
      number: (value) => (value.trim().length < 1 ? "Número é obrigatório" : null),
      neighborhood: (value) => (value.trim().length < 2 ? "Bairro deve ter pelo menos 2 caracteres" : null),
      city: (value) => (value.trim().length < 2 ? "Cidade deve ter pelo menos 2 caracteres" : null),
      state: (value) => (value.trim().length < 2 ? "Estado deve ter pelo menos 2 caracteres" : null),
      postalCode: (value) => (value.trim().length < 3 ? "Código postal deve ter pelo menos 3 caracteres" : null),
    },
  });

  const handleSubmit = (values: CreateOrUpdateAddressDto) => {
    if (editingAddress) {
      updateAddressMutation.mutate({ id: editingAddress.id, data: values });
    } else {
      createAddressMutation.mutate(values);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    form.setValues({
      name: address.name,
      street: address.street,
      number: address.number,
      complement: address.complement || "",
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    });
    setModalOpened(true);
  };

  const handleDelete = (id: number) => {
    modals.openConfirmModal({
      title: "Confirmar exclusão",
      children: (
        <Text size="sm">
          Tem certeza que deseja excluir este endereço? Esta ação não pode ser desfeita.
        </Text>
      ),
      labels: { confirm: "Sim, excluir", cancel: "Cancelar" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        deleteAddressMutation.mutate(id);
      },
    });
  };

  const openCreateModal = () => {
    setEditingAddress(null);
    form.reset();
    setModalOpened(true);
  };

  const closeModal = () => {
    setModalOpened(false);
    setEditingAddress(null);
    form.reset();
  };

  return (
    <Container size="xl" mt="xl" mb="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Group gap="md">
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => navigate("/account")}
            >
              Voltar
            </Button>
          </Group>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={openCreateModal}
            color="dark"
          >
            Novo Endereço
          </Button>
        </Group>

        <Group justify="space-between" align="center">
          <Stack gap={4}>
            <Title order={2} c={isDark ? "white" : "dark"}>
              Meus Endereços
            </Title>
            <Text size="sm" c="dimmed">
              Gerencie seus endereços de entrega
            </Text>
          </Stack>
          <Badge size="lg" variant="light" color="blue">
            {addresses.length} endereço{addresses.length !== 1 ? 's' : ''}
          </Badge>
        </Group>

        {isLoading ? (
          <Text ta="center" c="dimmed">
            Carregando endereços...
          </Text>
        ) : addresses.length === 0 ? (
          <Card
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            style={{
              backgroundColor: isDark ? DARK_COLOR : "white",
            }}
          >
            <Stack align="center" gap="sm">
              <ThemeIcon size={60} variant="light" color="gray" radius="md">
                <IconMapPin size={30} />
              </ThemeIcon>
              <Stack gap="xs" align="center">
                <Text size="md" fw={500} c={isDark ? "white" : "dark"} ta="center">
                  Nenhum endereço cadastrado
                </Text>
                <Text size="sm" c="dimmed" ta="center">
                  Adicione seu primeiro endereço para facilitar suas compras
                </Text>
              </Stack>
              <Button 
                onClick={openCreateModal} 
                color="dark" 
                size="sm"
                leftSection={<IconPlus size={16} />}
              >
                Adicionar endereço
              </Button>
            </Stack>
          </Card>
        ) : (
          <Grid>
            {addresses.map((address) => (
              <Grid.Col key={address.id} span={{ base: 12, sm: 6, lg: 4 }}>
                <Card
                  shadow="sm"
                  p="md"
                  radius="md"
                  withBorder
                  style={{
                    backgroundColor: isDark ? DARK_COLOR : "white",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  styles={{
                    root: {
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                      },
                    },
                  }}
                >
                  <Stack gap="sm">
                    {/* Header com nome e ações */}
                    <Group justify="space-between" align="center">
                      <Group gap="xs">
                        <ThemeIcon size="sm" variant="light" color="blue" radius="sm">
                          <IconHome size={18} />
                        </ThemeIcon>
                        <Text fw={600} size="sm" c={isDark ? "white" : "dark"}>
                          {address.name}
                        </Text>
                      </Group>
                      <Group gap={8}>
                        <ActionIcon
                          size="xs"
                          variant="subtle"
                          onClick={() => handleEdit(address)}
                          title="Editar"
                          color="blue"
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          size="xs"
                          variant="subtle"
                          color="red"
                          onClick={() => handleDelete(address.id)}
                          title="Excluir"
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Group>

                    {/* Informações do endereço em layout compacto */}
                    <Stack gap={8}>
                      {/* Linha 1: Rua e número */}
                      <Group gap="xs" wrap="nowrap">
                        <IconRoad size={12} color="dimmed" style={{ flexShrink: 0 }} />
                        <Text size="xs" c="dimmed" style={{ flex: 1 }}>
                          {address.street}, {address.number}
                        </Text>
                      </Group>
                      
                      {/* Linha 2: Complemento (se existir) */}
                      {address.complement && (
                        <Group gap="xs" wrap="nowrap">
                          <IconBuilding size={12} color="dimmed" style={{ flexShrink: 0 }} />
                          <Text size="xs" c="dimmed" style={{ flex: 1 }}>
                            {address.complement}
                          </Text>
                        </Group>
                      )}
                      
                      {/* Linha 3: Bairro */}
                      <Group gap="xs" wrap="nowrap">
                        <IconMap size={12} color="dimmed" style={{ flexShrink: 0 }} />
                        <Text size="xs" c="dimmed" style={{ flex: 1 }}>
                          {address.neighborhood}
                        </Text>
                      </Group>
                      
                      {/* Linha 4: Cidade e Estado */}
                      <Group gap="xs" wrap="nowrap">
                        <IconMapPin size={12} color="dimmed" style={{ flexShrink: 0 }} />
                        <Text size="xs" c="dimmed" style={{ flex: 1 }}>
                          {address.city} - {address.state}
                        </Text>
                      </Group>
                      
                      {/* Linha 5: CEP e País */}
                      <Group gap="xs" wrap="nowrap">
                        <IconHash size={12} color="dimmed" style={{ flexShrink: 0 }} />
                        <Text size="xs" c="dimmed" style={{ flex: 1 }}>
                          {address.postalCode} • {address.country}
                        </Text>
                      </Group>
                    </Stack>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Stack>

      {/* Modal para criar/editar endereço */}
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title={
          <Group gap="xs">
            <ThemeIcon size="sm" variant="light" color="blue" radius="sm">
              {editingAddress ? <IconEdit size={16} /> : <IconPlus size={16} />}
            </ThemeIcon>
            <Text fw={600}>
              {editingAddress ? "Editar Endereço" : "Novo Endereço"}
            </Text>
          </Group>
        }
        size="md"
        centered
        radius="md"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {/* Nome do endereço */}
            <TextInput
              label="Nome do endereço"
              placeholder="Ex: Casa, Trabalho, etc."
              {...form.getInputProps("name")}
              required
              leftSection={<IconHome size={16} />}
              size="sm"
            />

            {/* Rua e número */}
            <Grid gutter="xs">
              <Grid.Col span={8}>
                <TextInput
                  label="Rua"
                  placeholder="Nome da rua"
                  {...form.getInputProps("street")}
                  required
                  leftSection={<IconRoad size={16} />}
                  size="sm"
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Número"
                  placeholder="Nº"
                  {...form.getInputProps("number")}
                  required
                  leftSection={<IconHash size={16} />}
                  size="sm"
                />
              </Grid.Col>
            </Grid>

            {/* Complemento */}
            <TextInput
              label="Complemento"
              placeholder="Apartamento, bloco, etc. (opcional)"
              {...form.getInputProps("complement")}
              leftSection={<IconBuilding size={16} />}
              size="sm"
            />

            {/* Bairro */}
            <TextInput
              label="Bairro"
              placeholder="Nome do bairro"
              {...form.getInputProps("neighborhood")}
              required
              leftSection={<IconMap size={16} />}
              size="sm"
            />

            {/* Cidade e Estado */}
            <Grid gutter="xs">
              <Grid.Col span={6}>
                <TextInput
                  label="Cidade"
                  placeholder="Nome da cidade"
                  {...form.getInputProps("city")}
                  required
                  leftSection={<IconMapPin size={16} />}
                  size="sm"
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Estado/Província"
                  placeholder="Nome do estado"
                  {...form.getInputProps("state")}
                  required
                  leftSection={<IconFlag size={16} />}
                  size="sm"
                />
              </Grid.Col>
            </Grid>

            {/* CEP e País */}
            <Grid gutter="xs">
              <Grid.Col span={6}>
                <TextInput
                  label="Código Postal"
                  placeholder="Código postal"
                  {...form.getInputProps("postalCode")}
                  required
                  leftSection={<IconMail size={16} />}
                  size="sm"
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="País"
                  placeholder="País"
                  {...form.getInputProps("country")}
                  required
                  leftSection={<IconFlag size={16} />}
                  size="sm"
                />
              </Grid.Col>
            </Grid>

            {/* Botões de ação */}
            <Group justify="flex-end" gap="sm" mt="lg">
              <Button variant="outline" onClick={closeModal} size="sm">
                Cancelar
              </Button>
              <Button 
                type="submit" 
                color="dark" 
                size="sm"
                loading={createAddressMutation.isPending || updateAddressMutation.isPending}
                leftSection={editingAddress ? <IconEdit size={14} /> : <IconPlus size={14} />}
              >
                {editingAddress ? "Atualizar" : "Criar"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
