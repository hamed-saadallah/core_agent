import { BaseEntity } from './base.entity';
import { ChainEntity } from './chain.entity';
import { UserEntity } from './user.entity';
export declare class ChainRunEntity extends BaseEntity {
    chain: ChainEntity;
    chainId: string;
    user: UserEntity;
    userId: string;
    input: Record<string, any>;
    intermediateResults: Record<string, any>[];
    output: Record<string, any>;
    status: string;
    error: string;
    executionTime: number;
    metadata: Record<string, any>;
}
