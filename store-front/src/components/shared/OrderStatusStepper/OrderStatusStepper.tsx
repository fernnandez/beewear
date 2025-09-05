import { Stepper } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconCheck,
  IconCreditCard,
  IconPackage,
  IconTruck,
} from "@tabler/icons-react";

interface OrderStatusStepperProps {
  status: string;
}

export const OrderStatusStepper = ({ status }: OrderStatusStepperProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

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

  const getCurrentStepIndex = () => {
    const statusOrder = [
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
    ];
    return statusOrder.indexOf(status) >= 0 ? statusOrder.indexOf(status) : 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <Stepper
      active={currentStepIndex}
      size="sm"
      orientation={isMobile ? "vertical" : "horizontal"}
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
            icon={<StepIcon size={isMobile ? 16 : 14} />}
            completedIcon={<StepIcon size={isMobile ? 16 : 14} />}
            styles={{
              stepIcon: {
                backgroundColor: isCompleted
                  ? "var(--mantine-color-green-6)"
                  : isCurrent
                  ? "var(--mantine-color-yellow-6)"
                  : "var(--mantine-color-gray-4)",
                color: "white",
                border: "none",
              },
              stepLabel: {
                color: isCompleted
                  ? "var(--mantine-color-green-6)"
                  : isCurrent
                  ? "var(--mantine-color-yellow-6)"
                  : "var(--mantine-color-gray-6)",
                fontWeight: isCurrent ? 600 : 400,
              },
              stepDescription: {
                color: isCompleted
                  ? "var(--mantine-color-green-5)"
                  : isCurrent
                  ? "var(--mantine-color-yellow-5)"
                  : "var(--mantine-color-gray-5)",
              },
            }}
          />
        );
      })}
    </Stepper>
  );
};
