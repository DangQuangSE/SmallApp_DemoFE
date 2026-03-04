import { apiClient } from "./api.client";
import { API_ENDPOINTS } from "../constants/api";
import type {
    BrandDto,
    CreateBrandDto,
    UpdateBrandDto,
} from "../types/brand.types";

export const brandService = {
    getAll: async (): Promise<BrandDto[]> => {
        const response = await apiClient.get(API_ENDPOINTS.BRANDS.LIST);
        return response.data;
    },

    getById: async (brandId: number): Promise<BrandDto> => {
        const response = await apiClient.get(
            API_ENDPOINTS.BRANDS.DETAIL(brandId),
        );
        return response.data;
    },

    create: async (dto: CreateBrandDto): Promise<BrandDto> => {
        const response = await apiClient.post(API_ENDPOINTS.BRANDS.CREATE, dto);
        return response.data;
    },

    update: async (dto: UpdateBrandDto): Promise<BrandDto> => {
        const response = await apiClient.put(API_ENDPOINTS.BRANDS.UPDATE, dto);
        return response.data;
    },

    delete: async (brandId: number): Promise<void> => {
        await apiClient.delete(API_ENDPOINTS.BRANDS.DELETE(brandId));
    },
};
