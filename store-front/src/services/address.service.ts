import api from "./api";
import { Address, CreateOrUpdateAddressDto } from "../types/address";

export class AddressService {
  static async findAll(): Promise<Address[]> {
    const response = await api.get<Address[]>("/addresses");
    return response.data;
  }

  static async create(dto: CreateOrUpdateAddressDto): Promise<Address> {
    const response = await api.post<Address>("/addresses", dto);
    return response.data;
  }

  static async update(id: number, dto: CreateOrUpdateAddressDto): Promise<Address> {
    const response = await api.put<Address>(`/addresses/${id}`, dto);
    return response.data;
  }

  static async remove(id: number): Promise<void> {
    await api.delete(`/addresses/${id}`);
  }
} 