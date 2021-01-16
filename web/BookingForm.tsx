import moment from "moment";
import Form from "antd/lib/form";
import Select from "antd/lib/select";
import DatePicker from "antd/lib/date-picker";
import TimePicker from "antd/lib/time-picker";
import Input from "antd/lib/input";

import { FormInstance, Rule } from "antd/lib/form";
import {
  getDisabledDaysBeforeCurrent,
  getDisabledHoursByWorkTime,
} from "./util/datetime";
const { Option } = Select;

//Props
export interface IBookingFormProps {
  office: {
    name: string;
    address: string;
    startTime: string;
    endTime: string;
  };
  examRooms: Array<{
    index: number;
    name: string;
  }>;
  form: FormInstance;
  onFinish: (values: IBookingFormValues) => void;
}
// Form
export interface IBookingFormValues {
  examRoomIndex: number;
  scheduledDate: moment.Moment;
  scheduledTime: moment.Moment;
  duration: number;
  firstName: string;
  gender: "Male" | "Female";
  lastName: string;
}
// Form styles
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
// Rules
const PICKER_DATE_FORMAT = "YYYY/MM/DD";
const PICKER_TIME_FORMAT = "HH:mm";
const BookingFormRules: {
  [P in keyof IBookingFormValues]: Rule[];
} = {
  firstName: [
    { required: true, min: 2, message: "Please enter your first name!" },
  ],
  lastName: [
    { required: true, min: 2, message: "Please enter your last name!" },
  ],
  gender: [{ required: true, message: "Please set your gender!" }],
  examRoomIndex: [{ required: true, message: "Please select an exam room!" }],
  scheduledDate: [{ required: true }],
  scheduledTime: [{ required: true }],
  duration: [{ required: true }],
};
export function getDefaultPickerTime(): moment.Moment {
  return moment("15:00", PICKER_TIME_FORMAT);
}
export function getDefaultPickerDate(): moment.Moment {
  return moment().add(1, "days");
}
// API helpers
// Component
export default function BookingForm(props: IBookingFormProps) {
  return (
    <Form
      form={props.form}
      {...layout}
      initialValues={{
        scheduledTime: getDefaultPickerTime(),
        scheduledDate: getDefaultPickerDate(),
        duration: 60,
      }}
      onFinish={props.onFinish}
    >
      <Form.Item label="Office">
        {props.office.name + ", " + props.office.address}
      </Form.Item>
      <Form.Item
        label="First name"
        name="firstName"
        rules={BookingFormRules.firstName}
      >
        <Input type="text" placeholder="First name" />
      </Form.Item>
      <Form.Item
        label="Last name"
        name="lastName"
        rules={BookingFormRules.lastName}
      >
        <Input type="text" placeholder="Last name" />
      </Form.Item>
      <Form.Item name="gender" label="Gender" rules={BookingFormRules.gender}>
        <Select>
          <Option value={"Female"}>Female</Option>
          <Option value={"Male"}>Male</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="examRoomIndex"
        label="Exam room"
        rules={BookingFormRules.examRoomIndex}
      >
        <Select placeholder="Select exam room">
          {props.examRooms.map((room) => (
            <Option key={room.index} value={room.index}>
              {room.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="scheduledDate"
        rules={BookingFormRules.scheduledDate}
        label="Date"
      >
        <DatePicker
          disabledDate={getDisabledDaysBeforeCurrent}
          format={PICKER_DATE_FORMAT}
        />
      </Form.Item>
      <Form.Item
        name="scheduledTime"
        rules={BookingFormRules.scheduledTime}
        label="Time"
      >
        <TimePicker
          format={PICKER_TIME_FORMAT}
          disabledHours={() =>
            getDisabledHoursByWorkTime(
              props.office.startTime,
              props.office.endTime
            )
          }
        />
      </Form.Item>
      <Form.Item
        name="duration"
        rules={BookingFormRules.duration}
        label="Duration"
      >
        <Select>
          <Option value={30}>30 minutes</Option>
          <Option value={60}>1 hour</Option>
          <Option value={90}>1 hour 30 minutes</Option>
          <Option value={120}>2 hours</Option>
        </Select>
      </Form.Item>
    </Form>
  );
}
