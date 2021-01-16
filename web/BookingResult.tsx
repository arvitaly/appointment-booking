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
export default function BookingResult(props: IBookingResultProps) {
  const dt = new Date(props.appointment.scheduledDateTime);
  const scheduledDateTime =
    dt.toLocaleDateString() + " " + dt.toLocaleTimeString();
  return (
    <Result
      status="success"
      title={`Thank you for booking, ${
        props.patient.firstName + " " + props.patient.lastName
      }!`}
      subTitle={`Booking number:  ${props.appointment.id} Datetime: ${scheduledDateTime}`}
    />
  );
}
