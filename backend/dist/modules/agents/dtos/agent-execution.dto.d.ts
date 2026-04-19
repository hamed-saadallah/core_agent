export declare class SkillContextDto {
    skillName: string;
    output: Record<string, any>;
    error?: string;
}
export declare class ExecuteWithContextDto {
    userMessage: string;
}
export declare class ExecuteWithContextResponseDto {
    response: string;
    skillsUsed: string[];
    skillDetails: SkillContextDto[];
}
