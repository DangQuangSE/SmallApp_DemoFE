import { apiClient } from "./api.client";
import { API_ENDPOINTS } from "../constants/api";
import type {
    CategoryDto,
    CreateCategoryDto,
    UpdateCategoryDto,
} from "../types/category.types";

export const categoryService = {
    getAll: async (): Promise<CategoryDto[]> => {
        const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.LIST);
        return response.data;
    },

    getById: async (typeId: number): Promise<CategoryDto> => {
        const response = await apiClient.get(
            API_ENDPOINTS.CATEGORIES.DETAIL(typeId),
        );
        return response.data;
    },

    create: async (dto: CreateCategoryDto): Promise<CategoryDto> => {
        const response = await apiClient.post(
            API_ENDPOINTS.CATEGORIES.CREATE,
            dto,
        );
        return response.data;
    },

    update: async (dto: UpdateCategoryDto): Promise<CategoryDto> => {
        const response = await apiClient.put(
            API_ENDPOINTS.CATEGORIES.UPDATE,
            dto,
        );
        return response.data;
    },

    delete: async (typeId: number): Promise<void> => {
        await apiClient.delete(API_ENDPOINTS.CATEGORIES.DELETE(typeId));
    },
};
