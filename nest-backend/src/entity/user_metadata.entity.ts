import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";

@Entity()
export class UserMetadata {
    @OneToOne(() => User, (user) => user.user_metadata)
    @JoinColumn()
    user: User;
    @PrimaryGeneratedColumn()
    user_metadata_id: string;
    @Column({nullable: true})
    biography: string;
    @Column({nullable: true})
    location: string;
    @Column({nullable: true})
    online_status: string;
    @Column({nullable: true})
    avatar: string;
    @Column({nullable: true})
    cover_photo: string;
    @Column({unique: true, nullable: false})
    username: string;
}