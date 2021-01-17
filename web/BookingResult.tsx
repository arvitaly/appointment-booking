import Result from "antd/lib/result";
import { formatTimestampToLocaleString } from "./util/datetime";

export interface IBookingResultProps {
  appointment: {
    id: number;
    scheduledDateTime: number;
  };
  patient: {
    firstName: string;
    lastName: string;
  };
}
export default function BookingResult({
  appointment,
  patient,
}: IBookingResultProps) {
  const scheduledDateTime = formatTimestampToLocaleString(
    appointment.scheduledDateTime
  );
  return (
    <Result
      status="success"
      title={`Thank you for booking, ${`${patient.firstName} ${patient.lastName}`}!`}
      subTitle={`Booking number:  ${appointment.id} Datetime: ${scheduledDateTime}`}
    />
  );
}
