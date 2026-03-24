import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'prompts' })
export class PromptEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  systemPrompt: string;

  @Column({ type: 'text', nullable: true })
  userPrompt: string;

  @Column({ type: 'jsonb', nullable: true })
  examples: Array<{ input: string; output: string }>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  version: string;

  @ManyToOne(() => UserEntity)
  creator: UserEntity;

  @Column({ type: 'uuid' })
  creatorId: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
