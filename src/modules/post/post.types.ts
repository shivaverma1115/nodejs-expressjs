export type PostDto = {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  categoryId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
};
