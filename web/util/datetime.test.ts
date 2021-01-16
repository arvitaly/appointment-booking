import moment from "moment";
import {
  getDisabledHoursByWorkTime,
  joinMomentDateAndTimeToUtcString,
} from "./datetime";

test("joinMomentDateAndTimeToUtcString should works correct", () => {
  const date1 = moment("2021/01/16", "YYYY/MM/DD");
  const time1 = moment("20:00", "HH:mm");
  expect(joinMomentDateAndTimeToUtcString(date1, time1)).toBe(
    new Date(Date.parse(`2021-01-16 20:00:00`)).toISOString()
  );
});

test("getDisabledHoursByWorkTime should works correct", () => {
  expect(getDisabledHoursByWorkTime(`08:00:00`, `20:00:00`)).toEqual([
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    21,
    22,
    23,
  ]);
});
