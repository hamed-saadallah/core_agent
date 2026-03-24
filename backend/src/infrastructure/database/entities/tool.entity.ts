import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AgentEntity } from './agent.entity';

@Entity({ name: 'tools' })
export class ToolEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'jsonb' })
  schema: Record<string, any>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  category: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  config: Record<string, any>;

  @ManyToMany(() => AgentEntity, (agent) => agent.tools)
  agents: AgentEntity[];
}
