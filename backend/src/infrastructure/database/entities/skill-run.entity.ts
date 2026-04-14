import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SkillEntity } from './skill.entity';
import { UserEntity } from './user.entity';
import { AgentRunEntity } from './agent-run.entity';

@Entity({ name: 'skill_runs' })
@Index(['skillId', 'createdAt'])
@Index(['userId', 'createdAt'])
@Index(['agentRunId'])
export class SkillRunEntity extends BaseEntity {
  @ManyToOne(() => SkillEntity, (skill) => skill.runs)
  skill: SkillEntity;

  @Column({ type: 'uuid' })
  skillId: string;

  @ManyToOne(() => AgentRunEntity, { nullable: true })
  agentRun: AgentRunEntity;

  @Column({ type: 'uuid', nullable: true })
  agentRunId: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'jsonb' })
  input: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  output: Record<string, any>;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: 'pending' | 'running' | 'completed' | 'failed' | 'retried';

  @Column({ type: 'text', nullable: true })
  error: string;

  @Column({ type: 'integer', nullable: true })
  executionTime: number;

  @Column({ type: 'integer', default: 0 })
  retryCount: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
}
