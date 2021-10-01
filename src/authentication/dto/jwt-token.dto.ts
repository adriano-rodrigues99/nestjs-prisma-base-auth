import { UserDTO } from 'src/user/dto/user.dto';

export class JWTToken {
  token: string;
  user: UserDTO;
}
