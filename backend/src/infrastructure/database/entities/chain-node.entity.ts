import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ChainEntity } from './chain.entity';
import { AgentEntity } from './agent.entity';

@Entity({ name: 'chain_nodes' })
@Index(['chainId', 'order'])
export class ChainNodeEntity extends BaseEntity {
  @ManyToOne(() => ChainEntity, (chain) => chain.nodes, { onDelete: 'CASCADE' })
  chain: ChainEntity;

  @Column({ type: 'uuid' })
  chainId: string;

  @ManyToOne(() => AgentEntity, { eager: true })
  agent: AgentEntity;

  @Column({ type: 'uuid' })
  agentId: string;

  @Column({ type: 'integer' })
  order: number;

  @Column({ type: 'jsonb', nullable: true })
  nodeConfig: Record<string, any>;
}
