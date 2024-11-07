import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
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
import { FilesInterceptor } from '@nestjs/platform-express';
import { storageConfig } from '../config/storage.config';
import { SearchHotelParamsDto } from './dto/search-hotel-params.dto';
import { ValidateObjectIdPipe } from '../common/pipes/validate-object-id.pipe';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { UpdateHotelRoomDto } from './dto/update-hotel-room.dto';

@UseGuards(AuthenticatedGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminHotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post('hotels')
  createHotel(@Body() hotel: CreateHotelDto) {
    return this.hotelsService.createHotel(hotel);
  }

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
        fileIsRequired: false,
      }),
    )
    files: Express.Multer.File[],
  ) {
    const imagePaths = files ? files.map((file) => `/uploads/${file.filename}`) : [];
    const roomData = { ...room, images: imagePaths };

    return this.hotelsService.createHotelRoom(roomData);
  }

  @Get('hotels')
  findAllHotels(@Query() params: SearchHotelParamsDto) {
    return this.hotelsService.searchHotels(params);
  }

  @Put('hotels/:id')
  updateHotel(@Param('id', ValidateObjectIdPipe) id: string, @Body() params: UpdateHotelDto) {
    return this.hotelsService.updateHotel(id, params);
  }

  @Put('hotel-rooms/:id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: storageConfig,
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  updateHotelRoom(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() params: UpdateHotelRoomDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /\/(jpg|jpeg|png)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    files: Express.Multer.File[],
  ) {
    const existingImages = params.existingImages || [];
    const imagePaths = files ? files.map((file) => `/uploads/${file.filename}`) : [];
    const allImages = [...existingImages, ...imagePaths];
    const roomData = { ...params, images: allImages };

    return this.hotelsService.updateHotelRoom(id, roomData);
  }
}
