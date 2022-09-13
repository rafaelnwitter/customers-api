import { IsString, IsNotEmpty } from 'class-validator';
export class getAuthTokenDTO {
  @IsNotEmpty()
  @IsString()
  email: string;

  password?: string;

  @IsNotEmpty()
  @IsString()
  grant_type: string;

  @IsNotEmpty()
  @IsString()
  client_id: string;

  client_secret?: string;

  scope?: string;
}

export default getAuthTokenDTO;
