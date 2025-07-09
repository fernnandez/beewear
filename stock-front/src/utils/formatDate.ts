export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR");
};

export const formatDateShort = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};