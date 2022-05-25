import { IsNumber, IsString, MinLength } from 'class-validator'

export class LoginForm {
  @IsString()
  @MinLength(3)
    name: string
}
