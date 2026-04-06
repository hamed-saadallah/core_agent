import { Entity, Column, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AgentEntity } from './agent.entity';
import { ModelEntity } from './model.entity';
import { ProfileEntity } from './profile.entity';
import { PlanEntity } from './plan.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToOne(() => ProfileEntity, (profile) => profile.user, { eager: true, cascade: true })
  @JoinColumn()
  profile: ProfileEntity;

  @ManyToOne(() => PlanEntity, (plan) => plan.users)
  plan: PlanEntity;

  @OneToMany(() => AgentEntity, (agent) => agent.owner)
  agents: AgentEntity[];

  @OneToMany(() => ModelEntity, (model) => model.owner)
  models: ModelEntity[];
}
