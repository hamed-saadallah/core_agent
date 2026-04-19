import { ApiProperty } from '@nestjs/swagger';
import { ChatMessageDto } from './chat-message.dto';

export class ChatResponseDto {
  @ApiProperty({ description: 'Assistant response' })
  response: string;

  @ApiProperty({ description: 'Updated conversation history' })
  conversationHistory: ChatMessageDto[];
}
