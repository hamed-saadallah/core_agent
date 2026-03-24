import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AgentEntity } from './agent.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'agent_runs' })
@Index(['agentId', 'createdAt'])
@Index(['userId', 'createdAt'])
export class AgentRunEntity extends BaseEntity {
  @ManyToOne(() => AgentEntity, (agent) => agent.runs)
  agent: AgentEntity;

  @Column({ type: 'uuid' })
  agentId: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'jsonb' })
  input: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  output: Record<string, any>;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string;

  @Column({ type: 'text', nullable: true })
  error: string;

  @Column({ type: 'integer', nullable: true })
  executionTime: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
}
