import Result from "antd/lib/result";

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
  const dt = new Date(appointment.scheduledDateTime);
  const scheduledDateTime = `${dt.toLocaleDateString()} ${dt.toLocaleTimeString()}`;
  return (
    <Result
      status="success"
      title={`Thank you for booking, ${`${patient.firstName} ${patient.lastName}`}!`}
      subTitle={`Booking number:  ${appointment.id} Datetime: ${scheduledDateTime}`}
    />
  );
}
