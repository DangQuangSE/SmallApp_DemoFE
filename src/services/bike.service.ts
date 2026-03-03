import { axiosInstance } from "./auth.service";
import { API_ENDPOINTS } from "../constants/api";

// ===== DTOs =====
export interface BikeImageDto {
  mediaId: number;
  mediaUrl: string;
  mediaType?: string;
  isThumbnail?: boolean;
}

export interface BikePostDto {
  listingId: number;
  title: string;
  description?: string;
  price: number;
  listingStatus?: number; // 0=Hidden, 1=Active, 2=Pending, 3=Sold, 4=Rejected
  address?: string;
  postedDate?: string;
  bikeId: number;
  modelName?: string;
  serialNumber?: string;
  color?: string;
  condition?: string;
  brandName?: string;
  typeName?: string;
  frameSize?: string;
  frameMaterial?: string;
  wheelSize?: string;
  brakeType?: string;
  weight?: number;
  transmission?: string;
  sellerId: number;
  sellerName: string;
  images: BikeImageDto[];
  hasInspection: boolean;
}

export interface BikeFilterDto {
  searchTerm?: string;
  brandId?: number;
  typeId?: number;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  address?: string;
  sortBy?: string; // "newest" | "oldest" | "price_asc" | "price_desc"
  page?: number;
  pageSize?: number;
}

export interface CreateBikePostDto {
  title: string;
  description?: string;
  price: number;
  address?: string;
  brandId?: number;
  typeId?: number;
  modelName?: string;
  serialNumber?: string;
  color?: string;
  condition?: string;
  frameSize?: string;
  frameMaterial?: string;
  wheelSize?: string;
  brakeType?: string;
  weight?: number;
  transmission?: string;
  imageUrls: string[];
}

export interface UpdateBikePostDto extends CreateBikePostDto {
  listingId: number;
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

export const bikeService = {
  // Get bikes with filters (public)
  getBikes: async (
    filters?: BikeFilterDto,
  ): Promise<PagedResult<BikePostDto>> => {
    const response = await axiosInstance.get(API_ENDPOINTS.BIKES.LIST, {
      params: filters,
    });
    return response.data;
  },

  // Get bike detail (public)
  getBikeDetail: async (id: number): Promise<BikePostDto> => {
    const response = await axiosInstance.get(API_ENDPOINTS.BIKES.DETAIL(id));
    return response.data;
  },

  // Get brands (public)
  getBrands: async (): Promise<string[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.BIKES.BRANDS);
    return response.data;
  },

  // Create bike listing (auth)
  createBike: async (data: CreateBikePostDto): Promise<BikePostDto> => {
    const response = await axiosInstance.post(API_ENDPOINTS.BIKES.CREATE, data);
    return response.data;
  },

  // Update bike listing (auth)
  updateBike: async (data: UpdateBikePostDto): Promise<BikePostDto> => {
    const response = await axiosInstance.put(API_ENDPOINTS.BIKES.UPDATE, data);
    return response.data;
  },

  // Delete bike listing (auth)
  deleteBike: async (id: number): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.BIKES.DELETE(id));
  },

  // Toggle visibility (auth)
  toggleVisibility: async (id: number): Promise<void> => {
    await axiosInstance.patch(API_ENDPOINTS.BIKES.VISIBILITY(id));
  },

  // Get my posts (auth)
  getMyPosts: async (): Promise<BikePostDto[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.BIKES.MY_POSTS);
    return response.data;
  },
};
