import { ChatMessageDto } from './chat-message.dto';
export declare class CreateChatRequestDto {
    agentId: string;
    message: string;
    conversationHistory?: ChatMessageDto[];
}
