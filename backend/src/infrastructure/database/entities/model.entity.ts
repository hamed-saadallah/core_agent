import { Entity, Column, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { AgentEntity } from './agent.entity';

@Entity({ name: 'models' })
@Unique(['name', 'ownerId'])
export class ModelEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  version: string;

  @Column({ type: 'text' })
  apiKey: string;

  @Column({ type: 'varchar', length: 50, default: 'enabled' })
  status: string;

  @Column({
    type: 'decimal',
    default: 0.7,
    transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) },
  })
  temperature: number;

  @ManyToOne(() => UserEntity, (user) => user.models, { nullable: true })
  owner: UserEntity;

  @Column({ type: 'uuid', nullable: true })
  ownerId: string;

  @OneToMany(() => AgentEntity, (agent) => agent.model)
  agents: AgentEntity[];
}
