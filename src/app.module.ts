import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BookingModule } from "./apps/booking/booking.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // make available to every module
      envFilePath: ".env",
    }),
    BookingModule,
  ],
  controllers: [],
  providers: [],
  exports: [ConfigModule],
})
export class AppModule {}
