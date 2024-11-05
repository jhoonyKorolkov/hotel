import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/enums/role.enum';
import { AuthenticatedGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateHotelRoomDto } from './dto/create-hotel-room.dto';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { storageConfig } from '../config/storage.config';

@Controller('admin')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('hotels')
  createHotel(@Body() hotel: CreateHotelDto) {
    return this.hotelsService.createHotel(hotel);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('hotel-rooms')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: storageConfig,
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  createHotelRoom(
    @Body() room: CreateHotelRoomDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /\/(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ) {
    const imagePaths = files.map((file) => `/uploads/${file.filename}`) || [];
    const roomData = { ...room, images: imagePaths };

    return this.hotelsService.createHotelRoom(roomData);
  }
}
