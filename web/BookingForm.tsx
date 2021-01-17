import moment from "moment";
import Form, { FormInstance, Rule } from "antd/lib/form";
import Select from "antd/lib/select";
import DatePicker from "antd/lib/date-picker";
import TimePicker from "antd/lib/time-picker";
import Input from "antd/lib/input";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import TextArea from "antd/lib/input/TextArea";
import {
  getDisabledDaysBeforeCurrent,
  getDisabledHoursByWorkTime,
} from "./util/datetime";

const { Option } = Select;

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
  firstName: string;
  lastName: string;
  gender: "Male" | "Female";
  email: string;
  examRoomIndex: number;
  scheduledDate: moment.Moment;
  scheduledTime: moment.Moment;
  duration: number;
  reason: string;
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
  email: [
    { required: true, type: "email", message: "Please enter your email!" },
  ],
  gender: [{ required: true, message: "Please select your gender!" }],
  reason: [{ required: true, message: "Please input your reason!" }],
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
export default function BookingForm({
  examRooms,
  form,
  office,
  onFinish,
}: IBookingFormProps) {
  return (
    <Form
      className="booking_form"
      form={form}
      labelCol={layout.labelCol}
      wrapperCol={layout.wrapperCol}
      initialValues={{
        scheduledTime: getDefaultPickerTime(),
        scheduledDate: getDefaultPickerDate(),
        duration: 60,
      }}
      onFinish={onFinish}
    >
      <Row>
        <Col span={12}>
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
          <Form.Item label="Email" name="email" rules={BookingFormRules.email}>
            <Input type="text" placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={BookingFormRules.gender}
          >
            <Select>
              <Option value="Female">Female</Option>
              <Option value="Male">Male</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Reason"
            name="reason"
            rules={BookingFormRules.reason}
          >
            <TextArea />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Office">
            {`${office.name}, ${office.address}`}
          </Form.Item>
          <Form.Item
            name="examRoomIndex"
            label="Exam room"
            rules={BookingFormRules.examRoomIndex}
          >
            <Select placeholder="Select exam room">
              {examRooms.map((room) => (
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
                getDisabledHoursByWorkTime(office.startTime, office.endTime)
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
        </Col>
      </Row>
    </Form>
  );
}
