import { Center, Group, Pagination as MantinePagination } from "@mantine/core";
import { useEffect, useRef } from "react";
import { PaginationInfo } from "../../../types/pagination";

interface PaginationProps {
  paginationInfo: PaginationInfo;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  scrollToRef?: React.RefObject<HTMLElement | null>;
}

export function Pagination({
  paginationInfo,
  onPageChange,
  size = "md",
  scrollToRef,
}: PaginationProps) {
  const { currentPage, totalPages } = paginationInfo;

  const paginationRef = useRef<HTMLDivElement>(null);

  // Scroll suave para o topo quando a página muda
  useEffect(() => {
    const targetElement = scrollToRef?.current || paginationRef.current;
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentPage, scrollToRef]);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Center ref={paginationRef}>
      <Group gap="xs">
        <MantinePagination
          value={currentPage}
          onChange={onPageChange}
          total={totalPages}
          size={size}
          withEdges={false}
          siblings={0}
          color="yellow"
          radius="md"
        />
      </Group>
    </Center>
  );
}
