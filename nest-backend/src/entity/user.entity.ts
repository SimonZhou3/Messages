import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Messages} from "./messages.entity";
import {Contact} from "./contact.entity";
import {Notification} from './notification.entity';
import {UserMetadata} from "./user_metadata.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    user_id: string;
    @Column({unique: true})
    email: string;
    @Column({nullable: true})
    password: string;
    @Column({})
    first_name: string;
    @Column({})
    last_name: string;
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;
    @Column({default: () => 'false'})
    oauth_authenticated: boolean;
    @OneToMany(() => Messages, (messages) => messages.user)
    messages: Messages[];
    @OneToMany(() => Contact, (contact) => contact.user)
    contacts: Contact[];
    @OneToMany(() => Contact, (contact) => contact.contact_user)
    user_contacts: Contact[];
    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Notification[];
    @OneToOne(() => UserMetadata, (metadata) => metadata.user, {onDelete: "CASCADE"})
    user_metadata: UserMetadata
}
