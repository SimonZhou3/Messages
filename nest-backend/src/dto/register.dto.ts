import { IsNotEmpty } from 'class-validator';

export class RegisterDTO {
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    first_name: string;
    @IsNotEmpty()
    last_name: string;
    @IsNotEmpty()
    password: string;
}