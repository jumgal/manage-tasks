import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class AuthCredentialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Invalid Credentials'
    })
    password: string
}