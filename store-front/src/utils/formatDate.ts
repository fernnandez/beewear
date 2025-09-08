import { DateTime } from 'luxon';

export const formatDate = (dateString: string) => {
  const dateTime = DateTime.fromISO(dateString).setZone('America/Sao_Paulo');
  return dateTime.isValid ? dateTime.setLocale('pt-BR').toFormat('dd/MM/yyyy') : dateString;
};

export const formatDateShort = (dateString: string) => {
  const dateTime = DateTime.fromISO(dateString).setZone('America/Sao_Paulo');
  return dateTime.isValid ? dateTime.setLocale('pt-BR').toFormat('dd/MM/yyyy HH:mm') : dateString;
};

export const formatDateTime = (dateString: string) => {
  const dateTime = DateTime.fromISO(dateString).setZone('America/Sao_Paulo');
  return dateTime.isValid ? dateTime.setLocale('pt-BR').toFormat('dd/MM/yyyy HH:mm:ss') : dateString;
};

export const formatTime = (dateString: string) => {
  const dateTime = DateTime.fromISO(dateString).setZone('America/Sao_Paulo');
  return dateTime.isValid ? dateTime.setLocale('pt-BR').toFormat('HH:mm') : dateString;
};

export const formatRelative = (dateString: string) => {
  const dateTime = DateTime.fromISO(dateString).setZone('America/Sao_Paulo');
  return dateTime.isValid ? dateTime.setLocale('pt-BR').toRelative() || dateString : dateString;
};