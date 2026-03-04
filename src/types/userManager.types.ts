// Types mirroring BE DTOs for UserManager feature

export interface UserManagementDto {
  userId: number;
  username: string;
  email: string;
  roleId: number;
  roleName: string;
  status?: number;
  statusName: string;
  isVerified?: boolean;
  createdAt?: string;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  avatarUrl?: string;
  totalListings: number;
  totalOrders: number;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  roleId: number;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
}

export interface UpdateUserDto {
  userId: number;
  username?: string;
  email?: string;
  roleId?: number;
  status?: number;
  isVerified?: boolean;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
}

export interface UserFilterDto {
  search?: string;
  roleId?: number;
  status?: number;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface ResetPasswordDto {
  newPassword: string;
}
