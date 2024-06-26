import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { dynamoDBClient } from "@/config/dynamoDBClient";
import { v4 as uuid } from "uuid";
import { ErrorCode } from "@/enum";

const { ENV, BOOKING_TABLE } = process.env;

@Injectable()
export class BookingService {
  async create(createBookingDto: CreateBookingDto) {
    const { bookingDate, bookingSlot } = createBookingDto;
    const booking = await dynamoDBClient()
      .query({
        TableName: `${ENV}-${BOOKING_TABLE}-table`,
        IndexName: `bookingGlobalIndex`,
        KeyConditionExpression: `#bookingDate = :bookingDate AND #bookingSlot = :bookingSlot`,
        ExpressionAttributeNames: {
          "#bookingDate": "bookingDate",
          "#bookingSlot": "bookingSlot",
        },
        ExpressionAttributeValues: {
          ":bookingDate": bookingDate,
          ":bookingSlot": bookingSlot,
        },
      })
      .promise();
    if (booking.Items[0])
      throw new ConflictException(ErrorCode.This_Booking_Slot_Is_Not_Available);

    await dynamoDBClient()
      .put({
        TableName: `${ENV}-${BOOKING_TABLE}-table`,
        Item: {
          id: uuid(),
          bookingDate,
          bookingSlot,
        },
      })
      .promise();
    return { success: true };
  }

  async findAll() {
    const bookings = await dynamoDBClient()
      .scan({
        TableName: `${ENV}-${BOOKING_TABLE}-table`,
      })
      .promise();
    return { result: bookings.Items };
  }

  async findOne(id: string) {
    const booking = await dynamoDBClient()
      .query({
        TableName: `${ENV}-${BOOKING_TABLE}-table`,
        KeyConditionExpression: `#id = :id`,
        ExpressionAttributeNames: {
          "#id": "id",
        },
        ExpressionAttributeValues: {
          ":id": id,
        },
      })
      .promise();
    if (!booking.Items[0])
      throw new NotFoundException(ErrorCode.This_Booking_Not_Existed);
    return { result: booking.Items[0] };
  }

  async findBookingDate(date: string) {
    const booking = await dynamoDBClient()
      .query({
        TableName: `${ENV}-${BOOKING_TABLE}-table`,
        IndexName: `bookingGlobalIndex`,
        KeyConditionExpression: `#bookingDate = :bookingDate`,
        ExpressionAttributeNames: {
          "#bookingDate": "bookingDate",
        },
        ExpressionAttributeValues: {
          ":bookingDate": date,
        },
      })
      .promise();
    return { result: booking.Items };
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const booking = await dynamoDBClient()
      .query({
        TableName: `${ENV}-${BOOKING_TABLE}-table`,
        KeyConditionExpression: `#id = :id`,
        ExpressionAttributeNames: {
          "#id": "id",
        },
        ExpressionAttributeValues: {
          ":id": id,
        },
      })
      .promise();
    if (!booking.Items[0])
      throw new NotFoundException(ErrorCode.This_Booking_Not_Existed);
    const updateExpression = Object.keys(updateBookingDto)
      .map((key, index) => `#${key} = :${key}`)
      .join(", ");
    const expressionAttributeNames = Object.keys(updateBookingDto).reduce(
      (acc, key) => {
        acc[`#${key}`] = key;
        return acc;
      },
      {}
    );
    const expressionAttributeValues = Object.keys(updateBookingDto).reduce(
      (acc, key) => {
        acc[`:${key}`] = updateBookingDto[key];
        return acc;
      },
      {}
    );

    const response = await dynamoDBClient()
      .update({
        TableName: `${ENV}-${BOOKING_TABLE}-table`,
        Key: { id },
        UpdateExpression: `set ${updateExpression}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "UPDATED_NEW",
      })
      .promise();
    return { result: response.Attributes };
  }

  async remove(id: string) {
    const booking = await dynamoDBClient()
      .query({
        TableName: `${ENV}-${BOOKING_TABLE}-table`,
        KeyConditionExpression: `#id = :id`,
        ExpressionAttributeNames: {
          "#id": "id",
        },
        ExpressionAttributeValues: {
          ":id": id,
        },
      })
      .promise();
    if (!booking.Items[0])
      throw new NotFoundException(ErrorCode.This_Booking_Not_Existed);
    await dynamoDBClient()
      .delete({
        TableName: `${ENV}-${BOOKING_TABLE}-table`,
        Key: { id },
      })
      .promise();
    return { success: true };
  }
}
