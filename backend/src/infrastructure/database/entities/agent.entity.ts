import { Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { ToolEntity } from './tool.entity';
import { PromptEntity } from './prompt.entity';
import { AgentRunEntity } from './agent-run.entity';

@Entity({ name: 'agents' })
export class AgentEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  config: Record<string, any>;

  @ManyToOne(() => UserEntity, (user) => user.agents)
  owner: UserEntity;

  @Column({ type: 'uuid' })
  ownerId: string;

  @ManyToMany(() => ToolEntity, { eager: true })
  @JoinTable({ name: 'agent_tools' })
  tools: ToolEntity[];

  @ManyToOne(() => PromptEntity, { eager: true })
  prompt: PromptEntity;

  @Column({ type: 'uuid', nullable: true })
  promptId: string;

  @OneToMany(() => AgentRunEntity, (run) => run.agent)
  runs: AgentRunEntity[];

  @Column({ type: 'varchar', length: 50, default: 'gpt-3.5-turbo' })
  model: string;

  @Column({ type: 'decimal', default: 0.7 })
  temperature: number;
}
