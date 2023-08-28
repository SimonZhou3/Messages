import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
@Index(["user", "contact_user"])
export class Contact {
    @PrimaryGeneratedColumn('uuid')
    contact_id: string;

    @ManyToOne(() => User, (user) => user.contacts)
    @JoinColumn()
    user: User;

    @ManyToOne(() => User, (user) => user.user_contacts)
    @JoinColumn()
    contact_user: User;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}
