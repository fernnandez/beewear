import { useAuth } from "@contexts/auth-context";
import {
  Alert,
  Button,
  Image,
  Modal,
  PasswordInput,
  Stack,
  Tabs,
  TextInput,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { loginFunction, register } from "@services/auth.service";
import {
  IconAlertCircle,
  IconLetterA,
  IconLock,
  IconMail,
} from "@tabler/icons-react";
import { getAxiosErrorMessage } from "@utils/getAxiosErrorMessage";
import { useState } from "react";

interface AuthModalProps {
  opened: boolean;
  onClose: () => void;
}

export const AuthModal = ({ opened, onClose }: AuthModalProps) => {
  const { login } = useAuth();
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const isDark = colorScheme === "dark";

  const [tab, setTab] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const loginForm = useForm({
    initialValues: { email: "", password: "" },
    validate: {
      email: (v) => (v.trim().length === 0 ? "Email é obrigatório" : null),
      password: (v) => (v.trim().length === 0 ? "Palavra-passe é obrigatória" : null),
    },
  });

  const registerForm = useForm({
    initialValues: { name: "", email: "", password: "" },
    validate: {
      name: (v) => (v.trim().length === 0 ? "Nome é obrigatório" : null),
      email: (v) => (v.trim().length === 0 ? "Email é obrigatório" : null),
      password: (v) => (v.trim().length === 0 ? "Palavra-passe é obrigatória" : null),
    },
  });

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const token = await loginFunction(loginForm.values);
      await login(token);

      notifications.show({
        title: "Início de sessão realizado com sucesso",
        message: "",
        color: "green",
      });
      onClose();
      loginForm.reset();
    } catch (err) {
      const message = getAxiosErrorMessage(
        err,
        "Erro ao iniciar sessão. Tente novamente."
      );
      notifications.show({ title: "Erro", message, color: "red" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setRegisterError("");
    try {
      const token = await register(registerForm.values);
      await login(token);
      // O perfil será carregado automaticamente pela função login
      notifications.show({
        title: "Registo realizado com sucesso",
        message: "",
        color: "green",
      });
      onClose();
      registerForm.reset();
    } catch (err) {
      const message = getAxiosErrorMessage(
        err,
        "Erro ao fazer registo. Tente novamente."
      );
      setRegisterError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={null} size="sm" centered>
      <Stack align="center" gap="xs" mb="sm">
        <Image w={70} src="/favicon.svg" />
        <Title order={3}>Beewear</Title>
      </Stack>

      <Tabs value={tab} onChange={(v) => setTab(v as "login" | "register")}>
        <Tabs.List grow>
          <Tabs.Tab value="login">Iniciar Sessão</Tabs.Tab>
          <Tabs.Tab value="register">Registar</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="login" pt="sm">
          <form onSubmit={loginForm.onSubmit(handleLogin)}>
            <Stack>
              <TextInput
                label="Email"
                placeholder="seu@email.com"
                leftSection={<IconMail size={16} />}
                withAsterisk
                {...loginForm.getInputProps("email")}
              />
              <PasswordInput
                label="Palavra-passe"
                placeholder="Digite a sua palavra-passe"
                leftSection={<IconLock size={16} />}
                withAsterisk
                {...loginForm.getInputProps("password")}
              />
              <Button
                mt="md"
                type="submit"
                loading={isLoading}
                fullWidth
                style={{
                  backgroundColor: isDark ? theme.colors.yellow[6] : undefined,
                  color: isDark ? theme.black : undefined,
                }}
              >
                {isLoading ? "A iniciar sessão..." : "Iniciar Sessão"}
              </Button>
            </Stack>
          </form>
        </Tabs.Panel>

        <Tabs.Panel value="register" pt="sm">
          <form onSubmit={registerForm.onSubmit(handleRegister)}>
            <Stack>
              {registerError && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color="red"
                  title="Erro"
                >
                  {registerError}
                </Alert>
              )}
              <TextInput
                label="Nome"
                placeholder="João Silva"
                leftSection={<IconLetterA size={16} />}
                withAsterisk
                {...registerForm.getInputProps("name")}
              />
              <TextInput
                label="Email"
                placeholder="seu@email.com"
                leftSection={<IconMail size={16} />}
                withAsterisk
                {...registerForm.getInputProps("email")}
              />
              <PasswordInput
                label="Palavra-passe"
                placeholder="Digite a sua palavra-passe"
                leftSection={<IconLock size={16} />}
                withAsterisk
                {...registerForm.getInputProps("password")}
              />
              <Button
                mt="md"
                type="submit"
                loading={isLoading}
                fullWidth
                style={{
                  backgroundColor: isDark ? theme.colors.yellow[6] : undefined,
                  color: isDark ? theme.black : undefined,
                }}
              >
                {isLoading ? "A registar..." : "Registar"}
              </Button>
            </Stack>
          </form>
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
};
