import { IsNotEmpty } from 'class-validator';

export class UserMetadataDTO {
    @IsNotEmpty()
    url: string;
    @IsNotEmpty()
    biography: string;
    @IsNotEmpty()
    location: string;
}