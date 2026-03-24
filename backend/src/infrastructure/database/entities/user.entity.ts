import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AgentEntity } from './agent.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => AgentEntity, (agent) => agent.owner)
  agents: AgentEntity[];
}
