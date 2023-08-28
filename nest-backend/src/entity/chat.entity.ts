import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";
import {Messages} from "./messages.entity";

export enum Chat_Type {
    PRIVATE = 'private',
    GROUP = 'group'
}

@Entity()
export class Chat {
    @PrimaryGeneratedColumn('uuid')
    chat_id: string;

    @Column({nullable: true})
    chat_name: string;

    @Column({type: 'enum', enum: Chat_Type})
    chat_type: Chat_Type;
    @Column({nullable: true})
    chat_photo: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;

    @ManyToMany(() => User)
    @JoinTable()
    users: User[];

    @OneToMany(() => Messages, (messages) => messages.chat, {onDelete: "CASCADE"})
    messages: Messages[];
}