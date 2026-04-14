import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ChainEntity } from './chain.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'chain_runs' })
@Index(['chainId', 'createdAt'])
@Index(['userId', 'createdAt'])
export class ChainRunEntity extends BaseEntity {
  @ManyToOne(() => ChainEntity, (chain) => chain.runs)
  chain: ChainEntity;

  @Column({ type: 'uuid' })
  chainId: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'jsonb' })
  input: Record<string, any>;

  @Column({ type: 'jsonb', default: '[]' })
  intermediateResults: Record<string, any>[];

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
