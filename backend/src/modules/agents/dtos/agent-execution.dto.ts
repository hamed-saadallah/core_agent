import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SkillContextDto {
  @ApiProperty({ description: 'Name of the skill executed' })
  skillName: string;

  @ApiProperty({ description: 'Output data from skill execution' })
  output: Record<string, any>;

  @ApiProperty({ description: 'Error message if skill failed', required: false })
  error?: string;
}

export class ExecuteWithContextDto {
  @ApiProperty({ description: 'User message to send to the agent' })
  @IsString()
  @IsNotEmpty()
  userMessage: string;
}

export class ExecuteWithContextResponseDto {
  @ApiProperty({ description: 'Response from the agent' })
  response: string;

  @ApiProperty({ description: 'List of skills that were executed' })
  skillsUsed: string[];

  @ApiProperty({ description: 'Detailed information about each skill executed' })
  skillDetails: SkillContextDto[];
}
