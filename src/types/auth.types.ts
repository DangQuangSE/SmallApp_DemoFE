// ===== Shared DTOs =====

export interface UserProfileDto {
  userId: number;
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  address?: string;
  roleName: string; // "Admin" | "Buyer" | "Seller" | "Inspector"
  status?: number; // 0=Banned, 1=Active
  isVerified?: boolean;
  createdAt?: string;
}

// ===== Auth DTOs =====

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
  roleId: number; // 2=Buyer, 3=Seller
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResultDto {
  succeeded: boolean;
  token?: string;
  user?: UserProfileDto;
  errorMessage?: string;
  requiresEmailConfirmation: boolean;
}

// ===== Profile DTOs =====

export interface UpdateProfileDto {
  fullName?: string;
  phoneNumber?: string;
  address?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
