import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageDto {
  @ApiProperty({ description: 'Message role', enum: ['user', 'assistant'] })
  @IsNotEmpty()
  @IsIn(['user', 'assistant'])
  role: 'user' | 'assistant';

  @ApiProperty({ description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
