import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthUser } from '../auth/auth-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdatePrivacyDto } from './dto/update-privacy.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@AuthUser('id') userId: string) {
    return this.usersService.getMe(userId);
  }

  @Patch('me/profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(@AuthUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Patch('me/privacy')
  @UseGuards(JwtAuthGuard)
  updatePrivacy(@AuthUser('id') userId: string, @Body() dto: UpdatePrivacyDto) {
    return this.usersService.updatePrivacy(userId, dto);
  }

  @Get(':username')
  getPublicProfile(@Param('username') username: string) {
    return this.usersService.getPublicProfile(username);
  }
}
