import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";
import {Chat, Chat_Type} from "./chat.entity";

@Entity()
export class Messages {
    @PrimaryGeneratedColumn('uuid')
    message_id: string;

    @ManyToOne(() => Chat, (user) => user.messages)
    chat: Chat;

    @ManyToOne(() => User)
    @JoinTable()
    user: User;

    @Column()
    message: string;

    @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column()
    seen: boolean;

    @Column("text", {array: true, nullable: true})
    images: string[];

}