/* eslint-disable @typescript-eslint/no-var-requires */
import { ChildProcess, exec } from "child_process";
import { Page } from "puppeteer";

jest.setTimeout(10000);

const doctor = require("../__fixtures__/drchrono/doctors.json")[0];
const office = require("../__fixtures__/drchrono/offices.json")[0];

declare let page: Page;
describe("Google", () => {
  let appProc: ChildProcess;
  let mockProc: ChildProcess;
  beforeAll(async () => {
    appProc = exec(`bin/python3 -m flask run`, {
      cwd: `${__dirname}/..`,
      env: {
        FLASK_APP: "drchrono_mock",
        FLASK_RUN_PORT: "7030",
      },
    });
    mockProc = exec(`bin/python3 -m flask run`, {
      cwd: `${__dirname}/..`,
      env: {
        FLASK_APP: "backend",
        FLASK_RUN_PORT: "7040",
        DRCHRONO_BASE_URL: `http://127.0.0.1:7030`,
        DRCHRONO_DOCTOR_ID: doctor.id,
        DRCHRONO_OFFICE_ID: office.id,
      },
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));
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
    expect((await page.$$(".ant-form-item-has-error")).length).toBeGreaterThan(
      2
    );
  });

  afterAll(() => {
    appProc.kill("SIGTERM");
    mockProc.kill("SIGTERM");
  });
});
