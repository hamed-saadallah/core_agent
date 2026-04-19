import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { ChainNodeEntity } from './chain-node.entity';
import { ChainRunEntity } from './chain-run.entity';
export declare class ChainEntity extends BaseEntity {
    name: string;
    description: string;
    status: string;
    startingPrompt: string;
    config: Record<string, any>;
    owner: UserEntity;
    ownerId: string;
    nodes: ChainNodeEntity[];
    runs: ChainRunEntity[];
}
