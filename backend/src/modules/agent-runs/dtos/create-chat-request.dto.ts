import { IsString, IsNotEmpty, IsUUID, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ChatMessageDto } from './chat-message.dto';

export class CreateChatRequestDto {
  @ApiProperty({ description: 'Agent ID' })
  @IsUUID()
  @IsNotEmpty()
  agentId: string;

  @ApiProperty({ description: 'User message' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ description: 'Conversation history' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  conversationHistory?: ChatMessageDto[];
}
