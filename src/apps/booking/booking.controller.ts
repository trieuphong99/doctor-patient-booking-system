import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";

@Controller("booking")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post("/create")
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get("/")
  findAll() {
    return this.bookingService.findAll();
  }

  @Get("/detail/:id")
  findOne(@Param("id") id: string) {
    return this.bookingService.findOne(id);
  }

  @Get("/date/:date")
  findBookingDate(@Param("date") date: string) {
    return this.bookingService.findBookingDate(date);
  }

  @Put("/update/:id")
  update(@Param("id") id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete("/remove/:id")
  remove(@Param("id") id: string) {
    return this.bookingService.remove(id);
  }
}
