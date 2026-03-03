import { axiosInstance } from "./auth.service";
import { API_ENDPOINTS } from "../constants/api";
import type {
  CreateRatingDto,
  RatingDto,
  SellerStatsDto,
} from "../types/rating.types";

export const ratingService = {
  /** Create a rating for a completed order */
  create: async (dto: CreateRatingDto): Promise<RatingDto> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.RATINGS.CREATE,
      dto,
    );
    return response.data;
  },

  /** Get all ratings for a seller (public) */
  getBySeller: async (sellerId: number): Promise<RatingDto[]> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.RATINGS.BY_SELLER(sellerId),
    );
    return response.data;
  },

  /** Get seller reputation stats (public) */
  getSellerStats: async (sellerId: number): Promise<SellerStatsDto> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.RATINGS.SELLER_STATS(sellerId),
    );
    return response.data;
  },

  /** Check if an order has been rated */
  hasRatedOrder: async (orderId: number): Promise<boolean> => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.RATINGS.CHECK(orderId),
    );
    return response.data;
  },
};
