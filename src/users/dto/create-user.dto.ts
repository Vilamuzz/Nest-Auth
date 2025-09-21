import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'Secret123' })
  password: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;
}
