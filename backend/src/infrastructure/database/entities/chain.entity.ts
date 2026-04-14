import { Entity, Column, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { ChainNodeEntity } from './chain-node.entity';
import { ChainRunEntity } from './chain-run.entity';

@Entity({ name: 'chains' })
@Unique(['name', 'ownerId'])
export class ChainEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @Column({ type: 'text' })
  startingPrompt: string;

  @Column({ type: 'jsonb', nullable: true })
  config: Record<string, any>;

  @ManyToOne(() => UserEntity, (user) => user.chains, { nullable: true })
  owner: UserEntity;

  @Column({ type: 'uuid', nullable: true })
  ownerId: string;

  @OneToMany(() => ChainNodeEntity, (node) => node.chain, { cascade: true, eager: true })
  nodes: ChainNodeEntity[];

  @OneToMany(() => ChainRunEntity, (run) => run.chain)
  runs: ChainRunEntity[];
}
