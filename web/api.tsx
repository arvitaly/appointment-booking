import { IBookingFormValues } from "./BookingForm";
import { IDtoCreateAppointment, IDtoCreatedAppointment } from "./dto";
import { joinMomentDateAndTimeToUtcString } from "./util/datetime";

export interface IApiConfig {
  baseUrl: string;
  accessToken: string;
}
export async function createAppointment(
  values: IBookingFormValues,
  apiConfig: IApiConfig
): Promise<IDtoCreatedAppointment> {
  const data: IDtoCreateAppointment = {
    examRoomIndex: values.examRoomIndex,
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    gender: values.gender,
    duration: values.duration,
    reason: values.reason,
    scheduledTimestamp: new Date(
      joinMomentDateAndTimeToUtcString(
        values.scheduledDate,
        values.scheduledTime
      )
    ).getTime(),
  };
  const response = await fetch(`${apiConfig.baseUrl}/appointments`, {
    body: JSON.stringify(data),
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiConfig.accessToken}`,
      "Content-Type": "application/json",
    },
  });
  if (response.status !== 200) {
    if (response.status === 409) {
      throw new Error(`Please, choose another time`);
    }
    throw new Error(await response.text());
  }
  return response.json();
}
