import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  @Matches(`^(2[0-9][0-9][0-9])-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$`)
  bookingDate: string;

  @IsString()
  @IsNotEmpty()
  @Matches(`^(0[8-9]|1[0-7]):00$|^18:00$`)
  bookingSlot: string;
}
