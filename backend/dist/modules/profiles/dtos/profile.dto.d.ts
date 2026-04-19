export declare class ProfileDto {
    firstName: string;
    lastName: string;
    avatarUrl: string;
}
declare const UpdateProfileDto_base: import("@nestjs/common").Type<Partial<ProfileDto>>;
export declare class UpdateProfileDto extends UpdateProfileDto_base {
}
export {};
