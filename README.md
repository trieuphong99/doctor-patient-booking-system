# Doctor-Patient Booking System

This is a simple CRUD system for booking appointments between doctors and patients using the Serverless Framework with Node.js and DynamoDB.

# Setup

1.`aws configure` to configure your aws access key and secret key 2. `npm install & npm run build` to install dependencies and generate **dist** folder containing built files applied for aws lambda 3. `sls deploy` to deploy source code and construct infrastructure

# Endpoint description

API Gateway: https://ibw6b7jqh1.execute-api.ap-southeast-1.amazonaws.com/

1.  Create booking: **POST /booking/create**

    request:
      {
        "bookingDate": "2024-06-29",
        "bookingSlot": "13:00"
      }

    response:
      {
        success: true
      }

2.  Get all booking: **GET /booking/**

    response:
      {
        "result": [
            {
                "id": "a3b921ec-f54f-4fe8-9872-7f7a716ab2c3",
                "bookingSlot": "13:00",
                "bookingDate": "2024-06-29"
            }
        ]
      }

3.  Get detail booking: **GET /booking/detail/a3b921ec-f54f-4fe8-9872-7f7a716ab2c3**

    response:
      {
        "result": {
            "id": "a3b921ec-f54f-4fe8-9872-7f7a716ab2c3",
            "bookingSlot": "13:00",
            "bookingDate": "2024-06-29"
        }
      }

4.  Get detail booking by date: **GET /booking/date/2024-06-29**

    response:
      {
        "result": [
            {
                "id": "a3b921ec-f54f-4fe8-9872-7f7a716ab2c3",
                "bookingSlot": "13:00",
                "bookingDate": "2024-06-29"
            }
        ]
      }

5.  update booking: **PUT /booking/update/a3b921ec-f54f-4fe8-9872-7f7a716ab2c3**

    request:
      {
        "bookingDate": "2024-06-29",
        "bookingSlot": "14:00"
      }
    response:
      {
        "result": {
            "bookingSlot": "14:00",
            "bookingDate": "2024-06-29"
        }
      }
    
6.  remove booking: **DELETE /booking/remove/a3b921ec-f54f-4fe8-9872-7f7a716ab2c3**

    response:
      {
        success: true
      }