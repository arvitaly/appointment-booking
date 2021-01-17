/* eslint-disable @typescript-eslint/no-var-requires */
import { Page } from "puppeteer";
import {
  antdInputTime,
  antdInputDate,
  antdSelect,
  getElementText,
  isElementVisible,
  sleep,
  IFlaskTestProcess,
  runFlaskProccess,
} from "../testutil";

jest.setTimeout(10000);

const doctor = require("../__fixtures__/drchrono/doctors.json")[0];
const office = require("../__fixtures__/drchrono/offices.json")[0];

const patient = {
  firstName: `John`,
  lastName: `Smith`,
  email: `jonny@gmail.com`,
  gender: `Male`,
};
const appointment = {
  examRoom: {
    index: 3,
    name: `Exam 3`,
  },
  duration: {
    value: 120,
    title: `2 hours`,
  },
  scheduledDate: {
    timestamp: new Date("2021-08-15T00:00:00"),
    value: `2021/08/15`,
  },
  scheduledTime: {
    timestamp: new Date("2021-08-15T12:47:00"),
    value: `12:47`,
  },
  reason: {
    value: `I'm hurt`,
  },
};

const PATIENT_NEXT_ID = 874893;
const APPOINTMENT_NEXT_ID = 54656345;
const DRCHRONO_ACCESS_TOKEN = `D_ACCESS_TOKEN_3432423`;

declare let page: Page;
describe("Google", () => {
  let appProc: IFlaskTestProcess;
  let mockProc: IFlaskTestProcess;

  beforeAll(async () => {
    appProc = await runFlaskProccess({
      env: {
        FLASK_APP: "drchrono_mock",
        FLASK_RUN_PORT: "7030",
        PATIENT_NEXT_ID: PATIENT_NEXT_ID.toString(),
        APPOINTMENT_NEXT_ID: APPOINTMENT_NEXT_ID.toString(),
      },
    });
    mockProc = await runFlaskProccess({
      env: {
        FLASK_APP: "backend",
        FLASK_RUN_PORT: "7040",
        DRCHRONO_BASE_URL: `http://127.0.0.1:7030`,
        DRCHRONO_DOCTOR_ID: doctor.id,
        DRCHRONO_OFFICE_ID: office.id,
        DRCHRONO_ACCESS_TOKEN,
      },
    });
    await sleep(500);
  });

  beforeEach(async () => {
    await page.goto("http://127.0.0.1:7040/");
  });

  it('should be titled with "Dr. LAST_NAME"', async () => {
    await expect(page.title()).resolves.toMatch(`Dr. ${doctor.last_name}`);
  });
  it("booking form should be opened after click on button", async () => {
    await page.click(`.banner__button`);
    const bookingForm = await page.$(".booking_form");
    expect(bookingForm).toBeTruthy();
    if (!bookingForm || !(await bookingForm.isIntersectingViewport())) {
      throw new Error("Booking form not shown after click on button");
    }
  });
  it("a submitting with empty fields should show an error", async () => {
    await page.click(`.banner__button`);
    await page.click(`.booking_submit_button`);
    // Check the errors fields length > 2
    expect((await page.$$(".ant-form-item-has-error")).length).toBeGreaterThan(
      2
    );
  });

  it("when submit the right values should create appointment and show result window", async () => {
    await page.click(`.banner__button`);
    await page.type(`#firstName`, patient.firstName);
    await page.type(`#lastName`, patient.lastName);
    await page.type(`#email`, patient.email);
    await antdSelect(page, `gender`, patient.gender);
    await page.type(`#reason`, appointment.reason.value.toString());
    await antdSelect(
      page,
      `examRoomIndex`,
      appointment.examRoom.name.toString()
    );
    await antdInputDate(page, `scheduledDate`, appointment.scheduledDate.value);
    await antdInputTime(page, `scheduledTime`, appointment.scheduledTime.value);
    await antdSelect(page, `duration`, appointment.duration.title.toString());
    await page.click(`.booking_submit_button`);
    await sleep(1000);
    if (!(await isElementVisible(page, ".ant-modal-body .ant-result"))) {
      throw new Error(`Not found result window`);
    }
    const resultTitleText = await getElementText(
      page,
      ".ant-modal-body .ant-result-title"
    );
    expect(resultTitleText).toContain(patient.firstName);
    expect(resultTitleText).toContain(patient.lastName);

    const resultSubTitleText = await getElementText(
      page,
      ".ant-modal-body .ant-result-subtitle"
    );
    // Format date & time on browser locale
    const [date, time] = await page.evaluate(
      (dt, tm) => {
        return [
          new Date(dt).toLocaleDateString(),
          new Date(tm).toLocaleTimeString(),
        ];
      },
      appointment.scheduledDate.timestamp.getTime(),
      appointment.scheduledTime.timestamp.getTime()
    );
    expect(resultSubTitleText).toContain(APPOINTMENT_NEXT_ID);
    expect(resultSubTitleText).toContain(date);
    expect(resultSubTitleText).toContain(time);
    expect(true).toBe(true);
  });

  afterAll(async () => {
    await appProc.close();
    await mockProc.close();
  });
});
