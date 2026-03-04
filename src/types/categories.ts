export type Categories = {
  id: number;
  name?: string;
};

export type CategoriesPayload = Omit<Categories, "id">;

