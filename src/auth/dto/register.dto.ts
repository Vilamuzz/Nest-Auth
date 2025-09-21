import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'Secret123' })
  password: string;

  @ApiProperty({ example: 'John Doe', required: false })
  name?: string;
}
