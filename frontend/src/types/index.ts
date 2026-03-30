export type Currency = 'RUB' | 'USD' | 'EUR';

export type GiftItem = {
  id: string;
  title: string;
  image: string;
  price: number;
  currency: Currency;
  description: string;
  tags: string[];
  link: string;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type Collection = {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  coverImage: string;
  tags: string[];
  items: GiftItem[];
  createdAt: string;
  updatedAt: string;
};

export type CreateCollectionData = Omit<Collection, 'id' | 'createdAt' | 'updatedAt' | 'items' | 'authorId' | 'authorName'>;
export type UpdateCollectionData = Partial<Omit<CreateCollectionData, 'authorId' | 'authorName'>>;
export type CreateGiftItemData = Omit<GiftItem, 'id' | 'createdAt'>;
export type UpdateGiftItemData = Partial<CreateGiftItemData>;

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
