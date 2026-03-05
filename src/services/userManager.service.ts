import { apiClient } from "./api.client";
import { API_ENDPOINTS } from "../constants/api";
import type {
    UserManagementDto,
    CreateUserDto,
    UpdateUserDto,
    UserFilterDto,
    PagedResult,
    ResetPasswordDto,
} from "../types/userManager.types";

export const userManagerService = {
    getUsers: async (
        filter: UserFilterDto,
    ): Promise<PagedResult<UserManagementDto>> => {
        const response = await apiClient.get(API_ENDPOINTS.USER_MANAGER.LIST, {
            params: filter,
        });
        return response.data;
    },

    getById: async (userId: number): Promise<UserManagementDto> => {
        const response = await apiClient.get(
            API_ENDPOINTS.USER_MANAGER.DETAIL(userId),
        );
        return response.data;
    },

    create: async (dto: CreateUserDto): Promise<UserManagementDto> => {
        const response = await apiClient.post(
            API_ENDPOINTS.USER_MANAGER.CREATE,
            dto,
        );
        return response.data;
    },

    update: async (dto: UpdateUserDto): Promise<UserManagementDto> => {
        const response = await apiClient.put(
            API_ENDPOINTS.USER_MANAGER.UPDATE,
            dto,
        );
        return response.data;
    },

    delete: async (userId: number): Promise<void> => {
        await apiClient.delete(API_ENDPOINTS.USER_MANAGER.DELETE(userId));
    },

    resetPassword: async (
        userId: number,
        dto: ResetPasswordDto,
    ): Promise<void> => {
        await apiClient.post(
            API_ENDPOINTS.USER_MANAGER.RESET_PASSWORD(userId),
            dto,
        );
    },
};
