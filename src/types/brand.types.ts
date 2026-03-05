// Types mirroring BE DTOs for Brand management

export interface BrandDto {
    brandId: number;
    brandName: string;
    country?: string;
    totalBicycles: number;
}

export interface CreateBrandDto {
    brandName: string;
    country?: string;
}

export interface UpdateBrandDto {
    brandId: number;
    brandName: string;
    country?: string;
}
