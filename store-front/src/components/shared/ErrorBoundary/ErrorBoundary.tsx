import { Box, Button, Container, Stack, Text, Title } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Erro capturado pelo ErrorBoundary:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container size="md" py={60}>
          <Box ta="center">
            <Stack gap="lg">
              <Title order={1} size="h2" c="red">
                Ops! Algo deu errado
              </Title>

              <Text size="lg" c="dimmed">
                Ocorreu um erro inesperado. Tente recarregar a página.
              </Text>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <Box
                  p="md"
                  bg="gray.1"
                  style={{ borderRadius: "8px", textAlign: "left" }}
                >
                  <Text size="sm" fw={600} mb="xs">
                    Detalhes do erro (apenas em desenvolvimento):
                  </Text>
                  <Text size="xs" c="red" style={{ fontFamily: "monospace" }}>
                    {this.state.error.message}
                  </Text>
                </Box>
              )}

              <Button
                leftSection={<IconRefresh size={16} />}
                onClick={this.handleRetry}
                size="md"
              >
                Tentar Novamente
              </Button>
            </Stack>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}
