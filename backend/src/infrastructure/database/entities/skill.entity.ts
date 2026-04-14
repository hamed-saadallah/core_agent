import { Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, Unique, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { SkillRunEntity } from './skill-run.entity';
import { AgentEntity } from './agent.entity';

@Entity({ name: 'skills' })
@Unique(['name', 'ownerId'])
@Index(['ownerId', 'status'])
export class SkillEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  type: 'api_call' | 'web_search' | 'document_parse' | 'data_transform' | 'external_service';

  @Column({ type: 'jsonb' })
  config: Record<string, any>;

  @Column({ type: 'jsonb' })
  inputSchema: Record<string, any>;

  @Column({ type: 'jsonb' })
  outputSchema: Record<string, any>;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @ManyToOne(() => UserEntity, (user) => user.skills, { nullable: true })
  owner: UserEntity;

  @Column({ type: 'uuid', nullable: true })
  ownerId: string;

  @Column({ type: 'jsonb', nullable: true })
  retryConfig: {
    maxRetries: number;
    backoffMs: number;
    retryOn: string[];
  };

  @Column({ type: 'integer', nullable: true })
  timeout: number;

  @OneToMany(() => SkillRunEntity, (run) => run.skill)
  runs: SkillRunEntity[];

  @ManyToMany(() => AgentEntity, (agent) => agent.skills)
  @JoinTable({ name: 'agent_skills' })
  agents: AgentEntity[];
}
