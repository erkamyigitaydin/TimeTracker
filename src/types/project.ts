export type Project = {
  id: string;
  clientId: string;
  name: string;
  code?: string;
  description?: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
};
