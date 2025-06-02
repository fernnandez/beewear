import { AppShell, Container, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css"; // Mantine CSS
import { theme } from "../../theme";
import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";
import "../.././styles/global.css"; // Importando o CSS global

export const Navigation = ({ children }: { children: React.ReactNode }) => {
  return (
    <MantineProvider theme={theme}>
      <AppShell
        header={{
          height: 56,
        }}
        styles={{
          root: {
            height: "100vh", // Garante que o AppShell ocupe toda a altura da tela
            display: "flex",
            flexDirection: "column", // Garante que o conteúdo e o footer estejam empilhados
          },
          main: {
            flex: 1, // Faz o conteúdo principal ocupar todo o espaço restante
            display: "flex",
            flexDirection: "column",
            marginTop: "56px", // Ajusta o espaço para o Header
          },
        }}
      >
        {/* Header com a tag AppShell.Header */}
        <AppShell.Header>
          <Header />
        </AppShell.Header>

        {/* Container que contém o conteúdo */}
        <Container
          style={{
            flex: 1, // Garante que o container ocupe todo o espaço disponível
            display: "flex",
            flexDirection: "column",
            maxWidth: "100vw",
            marginTop: "56px",
          }}
        >
          {children}
          <Footer />
        </Container>

      </AppShell>
    </MantineProvider>
  );
};
