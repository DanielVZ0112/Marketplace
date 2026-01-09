import * as bcrypt from 'bcrypt';
import { User } from '../../../../database/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

export class UserMapper {
  static async toEntity(dto: CreateUserDto): Promise<User> {
    const user = new User();
    user.email = dto.email;
    user.password = await bcrypt.hash(dto.password, 10);
    user.is_active = dto.is_active ?? true;
    return user;
  }
}

