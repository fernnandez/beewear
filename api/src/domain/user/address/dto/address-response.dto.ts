export class AddressResponseDto {
  id: number;
  name: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
