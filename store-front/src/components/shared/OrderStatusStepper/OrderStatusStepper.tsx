import { Stepper, useMantineColorScheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconCheck,
  IconCreditCard,
  IconPackage,
  IconTruck,
} from "@tabler/icons-react";
import { DARK_COLOR } from "@utils/constants";

interface OrderStatusStepperProps {
  status: string;
}

export const OrderStatusStepper = ({ status }: OrderStatusStepperProps) => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Define as etapas do pedido
  const steps = [
    {
      label: "Pagamento",
      description: "Aguardando confirmação",
      icon: IconCreditCard,
      status: "PENDING",
    },
    {
      label: "Confirmado",
      description: "Pedido confirmado",
      icon: IconCheck,
      status: "CONFIRMED",
    },
    {
      label: "Em Preparação",
      description: "Preparando para envio",
      icon: IconPackage,
      status: "PROCESSING",
    },
    {
      label: "Enviado",
      description: "A caminho da sua casa",
      icon: IconTruck,
      status: "SHIPPED",
    },
    {
      label: "Entregue",
      description: "Pedido entregue",
      icon: IconCheck,
      status: "DELIVERED",
    },
  ];

  // Determina o índice da etapa atual
  const getCurrentStepIndex = () => {
    const statusOrder = [
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
    ];
    const currentIndex = statusOrder.indexOf(status);
    return currentIndex >= 0 ? currentIndex : 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <Stepper
      active={currentStepIndex}
      size="sm"
      color="yellow"
      orientation={isMobile ? "vertical" : "horizontal"}
      style={{
        backgroundColor: isDark ? DARK_COLOR : "white",
        padding: isMobile ? "0.5rem" : "0.75rem",
        borderRadius: "0.5rem",
        overflowX: isMobile ? "visible" : "auto",
        WebkitOverflowScrolling: isMobile ? "auto" : "touch",
      }}
    >
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;

        return (
          <Stepper.Step
            key={step.status}
            label={step.label}
            description={step.description}
            icon={
              <StepIcon
                size={isMobile ? 16 : 14}
                style={{
                  color: isCompleted
                    ? "var(--mantine-color-green-6)"
                    : isCurrent
                    ? "var(--mantine-color-yellow-6)"
                    : "var(--mantine-color-gray-4)",
                }}
              />
            }
            completedIcon={
              <IconCheck
                size={isMobile ? 16 : 14}
                style={{ color: "var(--mantine-color-green-6)" }}
              />
            }
            styles={{
              stepBody: {
                textAlign: isMobile ? "left" : "center",
                minWidth: isMobile ? "auto" : "80px",
              },
              stepLabel: {
                fontSize: isMobile ? "0.875rem" : "0.75rem",
                fontWeight: isCurrent ? 600 : 400,
                color: isCurrent
                  ? "var(--mantine-color-yellow-6)"
                  : isCompleted
                  ? "var(--mantine-color-green-6)"
                  : "var(--mantine-color-gray-6)",
                lineHeight: 1.2,
              },
              stepDescription: {
                fontSize: isMobile ? "0.75rem" : "0.65rem",
                color: isCurrent
                  ? "var(--mantine-color-yellow-6)"
                  : "var(--mantine-color-gray-5)",
                lineHeight: 1.2,
                marginTop: isMobile ? "4px" : "2px",
              },
              step: {
                flex: isMobile ? "1 1 auto" : "0 0 auto",
              },
            }}
          />
        );
      })}
    </Stepper>
  );
};
