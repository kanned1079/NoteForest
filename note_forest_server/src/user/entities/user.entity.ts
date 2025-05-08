import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

@Entity('n_user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    username?: string;

    @Column()
    email: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })

    role: UserRole;

    @Column()
    password: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at?: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at?: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deleted_at?: Date;
}