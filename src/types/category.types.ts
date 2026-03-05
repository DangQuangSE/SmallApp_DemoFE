// Types mirroring BE DTOs for Category management

export interface CategoryDto {
    typeId: number;
    typeName: string;
    totalBicycles: number;
}

export interface CreateCategoryDto {
    typeName: string;
}

export interface UpdateCategoryDto {
    typeId: number;
    typeName: string;
}
