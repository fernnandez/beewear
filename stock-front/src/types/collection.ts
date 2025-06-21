export interface Collection {
  id: number;
  publicId: string;
  name: string;
  active: boolean;
  description: string;
  imageUrl: string | null;
  createdAt: string; // ou Date, dependendo do seu uso
  updatedAt: string; // ou Date
  deletedAt: string | null; // ou Date | null
}
