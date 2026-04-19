export declare class CreateToolDto {
    name: string;
    description: string;
    schema: Record<string, any>;
    category?: string;
    config?: Record<string, any>;
}
export declare class UpdateToolDto {
    name?: string;
    description?: string;
    schema?: Record<string, any>;
    category?: string;
    isActive?: boolean;
    config?: Record<string, any>;
}
