import { axiosInstance } from "./auth.service";
import { API_ENDPOINTS } from "../constants/api";
import type {
  BikePostDto,
  BikeFilterDto,
  CreateBikeFormValues,
  UpdateBikeFormValues,
  PagedResult,
} from "../types/bike.types";

// Re-export types for convenience
export type {
  BikePostDto,
  BikeImageDto,
  BikeFilterDto,
  CreateBikeFormValues,
  UpdateBikeFormValues,
  PagedResult,
} from "../types/bike.types";

// ===== FormData Helpers =====

/** Append shared text fields to FormData (used by both create & update) */
const appendBikeFields = (fd: FormData, values: CreateBikeFormValues): void => {
  fd.append("Title", values.title);
  fd.append("Price", values.price.toString());
  if (values.description) fd.append("Description", values.description);
  if (values.address) fd.append("Address", values.address);
  if (values.brandId) fd.append("BrandId", values.brandId.toString());
  if (values.typeId) fd.append("TypeId", values.typeId.toString());
  if (values.modelName) fd.append("ModelName", values.modelName);
  if (values.serialNumber) fd.append("SerialNumber", values.serialNumber);
  if (values.color) fd.append("Color", values.color);
  if (values.condition) fd.append("Condition", values.condition);
  if (values.frameSize) fd.append("FrameSize", values.frameSize);
  if (values.frameMaterial) fd.append("FrameMaterial", values.frameMaterial);
  if (values.wheelSize) fd.append("WheelSize", values.wheelSize);
  if (values.brakeType) fd.append("BrakeType", values.brakeType);
  if (values.weight) fd.append("Weight", values.weight.toString());
  if (values.transmission) fd.append("Transmission", values.transmission);
};

const buildCreateFormData = (values: CreateBikeFormValues): FormData => {
  const fd = new FormData();
  appendBikeFields(fd, values);
  // Append each file separately with same key "Images"
  values.imageFiles.forEach((f) => fd.append("Images", f));
  return fd;
};

const buildUpdateFormData = (values: UpdateBikeFormValues): FormData => {
  const fd = new FormData();
  fd.append("ListingId", values.listingId.toString());
  appendBikeFields(fd, values);
  // New image files — key is "NewImages" (NOT "Images")
  values.newFiles.forEach((f) => fd.append("NewImages", f));
  // Remove media IDs — each appended separately with same key
  values.removeMediaIds.forEach((id) =>
    fd.append("RemoveMediaIds", id.toString()),
  );
  // Thumbnail
  if (values.thumbnailMediaId)
    fd.append("ThumbnailMediaId", values.thumbnailMediaId.toString());
  return fd;
};

// ===== Service =====

export const bikeService = {
  /** Search bikes with filters (public) */
  getBikes: async (
    filters?: BikeFilterDto,
  ): Promise<PagedResult<BikePostDto>> => {
    // Remove undefined/null/empty params
    const params = filters
      ? Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v != null && v !== ""),
        )
      : undefined;
    const response = await axiosInstance.get(API_ENDPOINTS.BIKES.LIST, {
      params,
    });
    return response.data;
  },

  /** Get bike detail (public) */
  getBikeDetail: async (id: number): Promise<BikePostDto> => {
    const response = await axiosInstance.get(API_ENDPOINTS.BIKES.DETAIL(id));
    return response.data;
  },

  /** Get brands list (public) */
  getBrands: async (): Promise<string[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.BIKES.BRANDS);
    return response.data;
  },

  /** Get types list (public) */
  getTypes: async (): Promise<string[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.BIKES.TYPES);
    return response.data;
  },

  /** Create bike listing (auth) — uses FormData, NOT JSON */
  createBike: async (values: CreateBikeFormValues): Promise<BikePostDto> => {
    const formData = buildCreateFormData(values);
    // Do NOT set Content-Type header — let browser add multipart boundary
    const response = await axiosInstance.post(
      API_ENDPOINTS.BIKES.CREATE,
      formData,
    );
    return response.data;
  },

  /** Update bike listing (auth) — uses FormData, NOT JSON */
  updateBike: async (values: UpdateBikeFormValues): Promise<BikePostDto> => {
    const formData = buildUpdateFormData(values);
    const response = await axiosInstance.put(
      API_ENDPOINTS.BIKES.UPDATE,
      formData,
    );
    return response.data;
  },

  /** Delete bike listing (auth) */
  deleteBike: async (id: number): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.BIKES.DELETE(id));
  },

  /** Toggle visibility — Hidden ↔ Active (auth) */
  toggleVisibility: async (id: number): Promise<void> => {
    await axiosInstance.patch(API_ENDPOINTS.BIKES.VISIBILITY(id));
  },

  /** Get my posts (auth) */
  getMyPosts: async (): Promise<BikePostDto[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.BIKES.MY_POSTS);
    return response.data;
  },
};
