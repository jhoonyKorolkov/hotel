export class ResponseReservationDto {
  dateStart: string;
  dateEnd: string;
  hotelRoom: {
    description: string;
    images: string[];
  };
  hotel: {
    title: string;
    description: string;
  };
}
