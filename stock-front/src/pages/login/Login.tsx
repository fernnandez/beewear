import { useAuth } from "@contexts/auth-context";
import {
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Group,
  Image,
  PasswordInput,
  rem,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { getProfileInfo, loginFunction } from "@services/auth.service";
import { IconLock, IconMail, IconMoon, IconSun } from "@tabler/icons-react";
import { getAxiosErrorMessage } from "@utils/getAxiosErrorMessage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const { login, setUser } = useAuth();

  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) =>
        value.trim().length === 0 ? "Email é obrigatório" : null,
      password: (value) =>
        value.trim().length === 0 ? "Senha é obrigatória" : null,
    },
  });

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const token = await loginFunction({
        email: form.values.email,
        password: form.values.password,
      });

      login(token);

      const profileInfo = await getProfileInfo();
      setUser(profileInfo);

      notifications.show({
        title: "Login realizado com sucesso",
        message: "Bem-vindo ao sistema de gestão de estoque",
        color: "green",
      });

      navigate("/");
    } catch (err) {
      const message = getAxiosErrorMessage(
        err,
        "Erro ao fazer login. Tente novamente."
      );

      notifications.show({ title: "Erro", message, color: "red" });
    } finally {
      setIsLoading(false);
    }
  };

  const isDark = colorScheme === "dark";

  return (
    <Box
      h="100vh"
      style={{
        background: isDark
          ? theme.colors.dark[7]
          : "linear-gradient(135deg, #FFF9DB 0%, #FFF3BF 100%)",
      }}
    >
      <Container size="xs" pt={40}>
        <Center mb={30}>
          <Stack align="center">
            <Image w={100} src={"/favicon.svg"} />
            <Title order={1} style={{ color: isDark ? "white" : undefined }}>
              Beewear Stock
            </Title>
            <Text style={{ color: theme.colors.gray[isDark ? 5 : 6] }}>
              Faça login para acessar o sistema
            </Text>
          </Stack>
        </Center>

        <Card
          shadow="md"
          radius="md"
          p="xl"
          withBorder
          style={{
            backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
          }}
        >
          <Title
            order={3}
            ta="center"
            mb="sm"
            style={{ color: isDark ? theme.white : undefined }}
          >
            Entrar
          </Title>
          <Text
            size="sm"
            ta="center"
            mb="lg"
            style={{ color: theme.colors.gray[isDark ? 5 : 6] }}
          >
            Digite suas credenciais para acessar
          </Text>

          <form onSubmit={form.onSubmit(handleLogin)}>
            <Stack>
              <TextInput
                label="Email"
                placeholder="seu@email.com"
                leftSection={<IconMail size={16} />}
                withAsterisk
                {...form.getInputProps("email")}
                styles={{
                  input: {
                    backgroundColor: isDark
                      ? theme.colors.dark[7]
                      : theme.white,
                    color: isDark ? theme.white : theme.black,
                  },
                  label: {
                    color: isDark ? theme.colors.gray[4] : undefined,
                  },
                }}
              />

              <PasswordInput
                label="Senha"
                placeholder="Digite sua senha"
                leftSection={<IconLock size={16} />}
                withAsterisk
                {...form.getInputProps("password")}
                styles={{
                  input: {
                    backgroundColor: isDark
                      ? theme.colors.dark[7]
                      : theme.white,
                    color: isDark ? theme.white : theme.black,
                  },
                  label: {
                    color: isDark ? theme.colors.gray[4] : undefined,
                  },
                }}
              />

              <Button
                type="submit"
                loading={isLoading}
                fullWidth
                style={{
                  backgroundColor: isDark ? theme.colors.yellow[6] : undefined,
                  color: isDark ? theme.black : undefined,
                }}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </Stack>
          </form>

          <Divider label="Cadastro" labelPosition="center" my="md" />

          <Group>
            <Button
              variant="light"
              size="compact-sm"
              fullWidth
              onClick={() => navigate("/register")}
              disabled
              style={{
                backgroundColor: isDark
                  ? theme.colors.dark[4]
                  : theme.colors.gray[2],
                color: isDark ? theme.colors.gray[6] : theme.colors.gray[5],
                opacity: 0.5,
                cursor: "not-allowed",
              }}
            >
              Registrar
            </Button>
          </Group>

          <Divider label="Tema" labelPosition="center" my="md" />

          {colorScheme === "dark" ? (
            <Button
              size="compact-sm"
              fullWidth
              variant="default"
              onClick={() => setColorScheme("light")}
            >
              <IconSun size="1rem" />
            </Button>
          ) : (
            <Button
              size="compact-sm"
              fullWidth
              variant="default"
              onClick={() => setColorScheme("dark")}
            >
              <IconMoon size="1rem" />
            </Button>
          )}
        </Card>

        <Text
          size="xs"
          ta="center"
          mt={rem(30)}
          style={{ color: theme.colors.gray[isDark ? 5 : 6] }}
        >
          Sistema de Gestão de Estoque v1.0 • © 2025 - Todos os direitos
          reservados
        </Text>
      </Container>
    </Box>
  );
};
