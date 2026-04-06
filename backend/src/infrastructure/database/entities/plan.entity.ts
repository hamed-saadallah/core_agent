import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'plans' })
export class PlanEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int', default: 10 })
  maxAgents: number;

  @OneToMany(() => UserEntity, (user) => user.plan)
  users: UserEntity[];
}
