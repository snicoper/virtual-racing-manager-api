export interface GetBySlugResponse {
  id: string;
  userId: string;
  slug: string;
  nickname: string;
  firstName: string | null;
  lastName: string | null;
  country: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}
