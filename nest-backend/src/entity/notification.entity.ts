import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    notification_id: string;
    @ManyToOne(() => User, (user) => user.notifications)
    @JoinColumn()
    user: User;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;
    @Column()
    message: string;
    @Column()
    status: string;
}