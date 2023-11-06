import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {ILike, Repository} from "typeorm";
import {User} from "../entity/user.entity";
import {UserMetadata} from "../entity/user_metadata.entity";
import {v4 as uuidv4} from 'uuid';
import * as bcrypt from "bcrypt";
import {InjectRepository} from "@nestjs/typeorm";
import {RegisterDTO} from "../dto/register.dto";
import {UserMetadataDTO} from "../dto/usermetadata.dto";
import {Contact} from "../entity/contact.entity";
import {Chat, Chat_Type} from "../entity/chat.entity";
import {Messages} from "../entity/messages.entity";


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserMetadata)
        private userMetadataRepository: Repository<UserMetadata>,
        @InjectRepository(Contact)
        private contactRepository: Repository<Contact>,
        @InjectRepository(Chat)
        private chatRepository: Repository<Chat>,
        @InjectRepository(Messages)
        private messagesRepository: Repository<Messages>
    ) {
    }

    async findOneByEmail(email: string): Promise<User> {
        return (await this.userRepository.find({
            relations: {
                user_metadata: true
            },
            where: {
                email: ILike(`%${email}%`)
            }
        }))[0];
    }

    async findOneById(user_id: string): Promise<User> {
        return await this.userRepository.findOneBy({user_id: user_id})
    }

    async addUserToDatabase(registerDTO: RegisterDTO): Promise<User | HttpException> {
        if (await this.findOneByEmail(registerDTO.email)) {
            throw new HttpException('There is an account associated with this email', HttpStatus.FORBIDDEN);
        }
        try {
            const user = await this.generateUser(registerDTO);
            await this.userRepository.save(user);
            const userMetadata = await this.generateUserMetadata(user)
            await this.userMetadataRepository.save(userMetadata);
            return user;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.FORBIDDEN);
        }
    }

    async createOauthUser(profile: any): Promise<any> {
        const user = await this.generateOauthUser(profile);
        await this.userRepository.save(user);
        const userMetadata = await this.generateUserMetadata(user)
        await this.userMetadataRepository.save(userMetadata);
        return this.findOneByEmail(user.email);
    }

    async generateUser(registerDTO: RegisterDTO): Promise<User> {
        const salt = await bcrypt.genSalt(10);
        const user = new User();
        user.email = registerDTO.email;
        user.first_name = registerDTO.first_name;
        user.last_name = registerDTO.last_name;
        user.password = await bcrypt.hash(registerDTO.password, salt);
        return user;
    }

    async generateOauthUser(profile: any): Promise<User> {
        const user = new User();
        user.email = profile.email;
        user.first_name = profile.first_name;
        user.last_name = profile.last_name;
        user.oauth_authenticated = true;
        return user;
    }

    async generateUserMetadata(user: User) {
        const userMetadata: UserMetadata = new UserMetadata();
        userMetadata.username = user.first_name + "-" + user.last_name + uuidv4();
        userMetadata.user = user;
        return userMetadata
    }

    async getUserMetadata(user: User) {
        return (await this.userRepository.find({
            relations: {
                user_metadata: true
            },
            where: {
                user_id: user.user_id,
            }
        }))[0];
    }

    async updateUserMetadata(user: User, metadata: UserMetadataDTO) {
        try {
            const userData: User = (await this.userRepository.find({
                relations: {
                    user_metadata: true
                },
                where: {
                    user_id: user.user_id
                }
            }))[0];
            userData.user_metadata.biography = metadata.biography;
            userData.user_metadata.location = metadata.location;
            userData.user_metadata.avatar = metadata.url;
            await this.userMetadataRepository.save(userData.user_metadata)
            return userData;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.FORBIDDEN)
        }
    }

    async checkFriendship(user_id, compare_user_id) {
        return (await this.contactRepository.find({
            where: {
                user: {user_id: user_id},
                contact_user: {user_id: compare_user_id}
            }
        })).length > 0;
    }

    async fetchUserSearch(query: string, offset: number, user: User) {
        const userQuery = this.userRepository
            .createQueryBuilder('u')
            .innerJoinAndSelect('u.user_metadata', 'um')
            .where('LOWER(CONCAT(u.first_name, \' \', u.last_name)) LIKE LOWER(:query)', {query: `%${query}%`})
            .andWhere('u.user_id <> :excludeId', {excludeId: user.user_id})
            .orderBy('u.user_id')
            .skip(offset)
            .take(5);

        const users = await userQuery.getMany();
        let result: any[] = [];
        for (let tuple of users) {
            const userResult = {
                ...tuple,
                isFriend: await this.checkFriendship(tuple.user_id, user.user_id)
            }
            result.push(userResult);
        }
        return result;
    }

    async loadProfile(logged_user: User, profile_id: string) {
        const userQuery = this.userRepository.createQueryBuilder('u')
            .select(['u.user_id', 'u.first_name', 'u.last_name', 'um.*'])
            .innerJoinAndSelect('u.user_metadata', 'um')
            .where('um.username = :profile_id', {profile_id})
        const userData = await userQuery.getOne();
        const isSelf: boolean = logged_user.user_id === userData.user_id;
        const isFriends: boolean = await this.checkFriendship(logged_user.user_id, userData.user_id);

        if (userData) {
            const subQuery = this.userMetadataRepository
                .createQueryBuilder('um')
                .select('c.contact_user.user_id')
                .innerJoin('contact', 'c', 'c.user.user_id = um.user.user_id')
                .where('um.username = :username', {username: profile_id})

            const query = this.userRepository
                .createQueryBuilder('u')
                .select(['u.first_name', 'u.last_name', 'um.avatar', 'um.username'])
                .innerJoin('u.user_metadata', 'um')
                .where(`u.user_id IN (${subQuery.getQuery()})`)
                .setParameters(subQuery.getParameters());

            const friends = await query.getRawMany();
            return {
                user_metadata: userData,
                friend_data: {
                    friends: friends,
                    count: friends.length
                },
                self_profile: isSelf,
                is_friends: isFriends
            }
        } else {
            throw new HttpException('Unable to fetch user profile', HttpStatus.NOT_ACCEPTABLE)
        }
    }

    async getChats(user: User): Promise<any> {
        const chats = await this.chatRepository
            .createQueryBuilder('c')
            .select(['c.chat_id', 'c.chat_name', 'c.chat_type', 'c.created_at', 'c.chat_photo'])
            .leftJoin('c.users', 'user')
            .where('user.user_id = :user_id', {user_id: user.user_id})
            .getMany();
        let chat_metadata = [];
        for (const chat of chats) {
            const recent_message = await this.messagesRepository.createQueryBuilder('m')
                .select(['m', 'u.first_name', 'u.last_name', 'um.avatar', 'u.user_id'])
                .innerJoin('m.user', 'u')
                .innerJoin('user_metadata', 'um', 'um.user.user_id = u.user_id')
                .where('m.chat.chat_id = :chat_id', {chat_id: chat.chat_id})
                .orderBy('m.created_at', 'DESC')
                .limit(1)
                .getOne();

            if (chat.chat_type === 'private') {

                const private_metadata = await this.chatRepository
                    .createQueryBuilder('c')
                    .select(['u.first_name as first_name', 'u.user_id as user_id', 'u.last_name as last_name', 'um.avatar as avatar'])
                    .innerJoin('c.users', 'u')
                    .innerJoin('user_metadata', 'um', 'u.user_id = um.user.user_id')
                    .where('c.chat_id = :chat_id', {chat_id: chat.chat_id})
                    .andWhere('u.user_id <> :self_id', {self_id: user.user_id})
                    .getRawOne();

                chat_metadata.push({chat, recent_message, private_metadata})
            } else {
                chat_metadata.push({chat, recent_message})
            }
        }
        chat_metadata.sort((a, b) => {
            const dateA: any = new Date(a?.recent_message?.created_at);
            const dateB: any = new Date(b?.recent_message?.created_at);
            return dateB - dateA;
        });
        return chat_metadata
    }

    async addFriend(self_user: User, user: User) {
        const self_contact: Contact = new Contact();
        self_contact.user = self_user;
        self_contact.contact_user = user;
        await this.contactRepository.save(self_contact);

        const other_contact: Contact = new Contact();
        other_contact.user = user;
        other_contact.contact_user = self_user;
        await this.contactRepository.save(other_contact);
    }

    async identifyAndCreateChat(self: User, users: User[]): Promise<any> {

        if (users.length > 1) {
            console.log(users);
          return {
              redirect: (await this.createChat(Chat_Type.GROUP, [self, ...users])).chat_id
          }
        } else if (users.length === 1) {
            let currentChat = await this.chatRepository
                .createQueryBuilder('c')
                .innerJoin("c.users", "user1", "user1.user_id = :userId1", { userId1: self.user_id })
                .innerJoin("c.users", "user2", "user2.user_id = :userId2", { userId2: users[0].user_id })
                .where("c.chat_type = :chatType", { chatType: Chat_Type.PRIVATE })
                .andWhere("user1.user_id = :userId1", { userId1: self.user_id })
                .andWhere("user2.user_id = :userId2", { userId2: users[0].user_id })
                .getOne();
            if (!currentChat) {
                await this.createChat(Chat_Type.PRIVATE, [self,...users])
            }
            return {
                redirect: users[0].user_id
            }
        } else {
            throw new HttpException('No Users were indicated', HttpStatus.NOT_ACCEPTABLE);
        }
    }

    async createChat(chat_type:Chat_Type, users: User[]) {
        const chat: Chat = new Chat()
        chat.chat_name = this.generateChatName(users);
        chat.users = users;
        chat.chat_type = chat_type;
        return await this.chatRepository.save(chat);
    }

    generateChatName(users: User[]): string {
        if (users.length > 2) {
            let chatName = '';
            let index = 1;
            for (const user of users) {
                if (index === users.length) {
                    chatName += user.first_name;
                } else {
                    chatName += user.first_name + ', ';
                }
                index++;
            }
            return chatName;
        } else {
            return null;
        }
    }

    async sendMessage(sender: User, chat: Chat, text: string, images: string[] | null): Promise<any> {
        const message: Messages = new Messages();
        message.user = sender;
        message.chat = chat;
        message.images = images;
        message.message = text;
        message.seen = false;
        return await this.messagesRepository.save(message);
    }

    async getContacts(user: User): Promise<any> {
        return await this.contactRepository
            .createQueryBuilder('c')
            .select(['u.first_name as first_name', 'u.last_name as last_name', 'um.avatar as avatar', 'u.user_id as user_id'])
            .innerJoin('user', 'u', 'u.user_id = c.contact_user.user_id')
            .innerJoin('user_metadata', 'um', 'um.user.user_id = u.user_id')
            .where('c.user.user_id = :user_id', {user_id: user.user_id})
            .getRawMany();
    }


    async fetchMessages(chat_id: string, self_user: User, limit: number): Promise<any> {
        // Case: Chat is a private chat
        const MESSAGE_LIMIT = limit * 20;
        let chat_metadata;
        let private_metadata;
        if (await this.findOneById(chat_id)) {
            chat_metadata = await this.chatRepository
                .createQueryBuilder('c')
                .select(['c.chat_id', 'c.chat_name', 'c.chat_photo', 'c.chat_type', 'c.created_at', 'u.user_id', 'u.first_name', 'u.last_name'])
                .leftJoin('c.users', 'u')
                .where('c.chat_type = :chat_type', {chat_type: 'private'})
                .andWhere((qb) => {
                    const subQuery = qb
                        .subQuery()
                        .select('c2.chat_id')
                        .from('chat', 'c2')
                        .leftJoin('c2.users', 'u2')
                        .where('u2.user_id IN (:user1, :user2)', {user1: chat_id, user2: self_user.user_id})
                        .groupBy('c2.chat_id')
                        .having('COUNT(c2.chat_id) = 2')
                        .getQuery();
                    return 'c.chat_id IN ' + subQuery;
                })
                .getOne();
            private_metadata = await this.userRepository
                .createQueryBuilder('u')
                .select(['u.first_name AS first_name', 'u.last_name AS last_name', 'um.*'])
                .leftJoin('user_metadata', 'um', 'um.user.user_id = u.user_id')
                .where('u.user_id = :user_id', {user_id: chat_id})
                .getRawOne();

        } else {
            chat_metadata = await this.chatRepository
                .createQueryBuilder('c')
                .innerJoinAndSelect('c.users', 'u')
                .where('c.chat_id = :chat_id', {chat_id: chat_id})
                .getOne()
        }
        if (chat_metadata) {
            const messages = await this.messagesRepository
                .createQueryBuilder('m')
                .select(['m.*', 'um.avatar AS avatar', 'um.username AS username'])
                .leftJoin('m.user', 'u')
                .leftJoin('user_metadata', 'um', 'u.user_id = um.user.user_id')
                .where('m.chat.chat_id = :chat_id', { chat_id: chat_metadata.chat_id })
                .orderBy('m.created_at', 'DESC')
                .limit(MESSAGE_LIMIT)
                .getRawMany();

                messages.reverse();

            return {
                chat_metadata,
                messages,
                private_metadata
            }
        } else {
            throw new HttpException("No Data Found", HttpStatus.NOT_ACCEPTABLE)
        }
    }
}



