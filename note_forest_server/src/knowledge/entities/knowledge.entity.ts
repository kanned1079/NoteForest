import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn, Index,
} from 'typeorm';

@Entity('n_knowledge')
export class Knowledge {
    @PrimaryGeneratedColumn('uuid') // 自动生成 UUID
    id: string;

    @Index()
    @Column({ nullable: false })
    title: string;

    @Column({ nullable: true })
    subtitle?: string;

    @Column({nullable: true})
    category: string

    @Column({nullable: false, type: 'longtext'})
    content: string;

    @Column({default: false})
    show: boolean;

    @Column({nullable: true})
    image_url?: string

    @CreateDateColumn({ type: 'timestamp' })
    created_at?: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at?: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deleted_at?: Date;
}