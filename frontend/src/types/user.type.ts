export type ITotalUser = Root2[];

export interface Root2 {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  isDeleted: boolean;
  isActive: string;
  isVerified: boolean;
  auths: Auth[];
  assignedParcels: unknown[];
  createdAt: string;
  updatedAt: string;
}

export interface Auth {
  provider: string;
  providerId: string;
}
