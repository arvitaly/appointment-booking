import "antd/dist/antd.css";
import { useReducer } from "react";
import Modal from "antd/lib/modal/Modal";
import message from "antd/lib/message";
import Button from "antd/lib/button";
import { useForm } from "antd/lib/form/Form";
import BookingForm, { IBookingFormValues } from "./BookingForm";
import { IDtoCreatedAppointment, IDtoPageData } from "./dto";
import Top from "./Top";
import Header from "./Header";
import Banner from "./Banner";
import Footer from "./Footer";
import { createAppointment } from "./api";
import BookingResult from "./BookingResult";

export interface IAppProps {
  data: IDtoPageData;
}

interface IAppState {
  bookingVisible: boolean;
  bookingLoading: boolean;
  bookingError: string | null;
  appointment: {
    id: number;
    scheduledDateTime: number;
  } | null;
  patient: {
    firstName: string;
    lastName: string;
  } | null;
  bookingResultModalVisible: boolean;
}

const initialState: IAppState = {
  bookingVisible: false,
  bookingLoading: false,
  bookingError: null,
  appointment: null,
  patient: null,
  bookingResultModalVisible: false,
};

export type AppAction =
  | { type: "BOOKING_LOADING" }
  | { type: "BOOKING_SUCCESS"; appointment: IDtoCreatedAppointment }
  | { type: "BOOKING_ERROR"; error: string }
  | { type: "BOOKING_SHOW" }
  | { type: "BOOKING_HIDE" }
  | { type: "BOOKING_RESULT_HIDE" };

export function AppReducer(state: IAppState, action: AppAction): IAppState {
  switch (action.type) {
    case "BOOKING_LOADING":
      return { ...state, bookingLoading: true };
    case "BOOKING_SUCCESS":
      return {
        ...state,
        bookingLoading: false,
        bookingVisible: false,
        appointment: action.appointment.appointment,
        patient: action.appointment.patient,
        bookingResultModalVisible: true,
      };
    case "BOOKING_ERROR":
      return { ...state, bookingLoading: false, bookingError: action.error };
    case "BOOKING_SHOW":
      return { ...state, bookingVisible: true };
    case "BOOKING_HIDE":
      return { ...state, bookingVisible: false };
    case "BOOKING_RESULT_HIDE":
      return { ...state, bookingResultModalVisible: false };
    default:
      return state;
  }
}

export default function App({ data }: IAppProps) {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // BookingForm ref
  const [bookingForm] = useForm();
  const handleOk = () => {
    bookingForm.submit();
  };

  const onBookingError = (error: string) => {
    message.error(error.toString());
    dispatch({ type: "BOOKING_ERROR", error });
  };

  const onFinish = (values: IBookingFormValues) => {
    dispatch({ type: "BOOKING_LOADING" });
    createAppointment(values, {
      baseUrl: data.apiBaseUrl,
      accessToken: data.apiAccessToken,
    })
      .then((res) => {
        bookingForm.resetFields();
        dispatch({ type: "BOOKING_SUCCESS", appointment: res });
      })
      .catch((error) => onBookingError(error));
  };
  const handleCancel = () => dispatch({ type: "BOOKING_HIDE" });
  const showBooking = () => dispatch({ type: "BOOKING_SHOW" });

  const handleResultOk = () => {
    dispatch({ type: "BOOKING_RESULT_HIDE" });
  };

  return (
    <div className="container">
      <Top
        officeAddress={data.office.address}
        officePhone={data.office.phone}
      />
      <Header
        doctorLastName={data.doctor.lastName}
        doctorSpecialty={data.doctor.specialty}
      />
      <Banner
        onButtonClick={showBooking}
        doctorPhoto={data.doctor.photo}
        officePhone={data.office.phone}
      />
      <Footer />
      <Modal
        style={{ minWidth: "700px" }}
        visible={state.bookingVisible}
        title="Appointment Booking"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            className="booking_submit_button"
            key="submit"
            type="primary"
            loading={state.bookingLoading}
            onClick={handleOk}
          >
            Submit
          </Button>,
        ]}
      >
        <BookingForm
          form={bookingForm}
          onFinish={onFinish}
          office={data.office}
          examRooms={data.examRooms}
        />
      </Modal>
      <Modal
        title="Success"
        cancelText=""
        visible={state.bookingResultModalVisible}
        onOk={handleResultOk}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        {state.appointment && state.patient ? (
          <BookingResult
            patient={state.patient}
            appointment={state.appointment}
          />
        ) : null}
      </Modal>
    </div>
  );
}
