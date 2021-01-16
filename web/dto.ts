export interface IDtoPageData {
  apiBaseUrl: string;
  apiAccessToken: string;
  office: {
    name: string;
    address: string;
    phone: string;
    startTime: string;
    endTime: string;
  };
  examRooms: Array<{
    index: number;
    name: string;
  }>;
  doctor: {
    firstName: string;
    lastName: string;
    specialty: string;
    photo: string;
  };
}

export interface IDtoCreateAppointment {
  examRoomIndex: number;
  firstName: string;
  lastName: string;
  gender: "Female" | "Male";
  duration: number;
  scheduledTimestamp: number;
}

export interface IDtoCreatedAppointment {
  appointment: {
    id: number;
    scheduledDateTime: number;
  };
  patient: {
    firstName: string;
    lastName: string;
  };
}
