import moment from "moment";

export function joinMomentDateAndTimeToUtcString(
  date: moment.Moment,
  time: moment.Moment
) {
  return new Date(
    Date.parse(date.format("YYYY-MM-DD") + " " + time.format(" HH:mm:00"))
  ).toISOString();
}

export function getDisabledHoursByWorkTime(startTime: string, endTime: string) {
  const startMomentHour = moment(startTime, "HH:mm:ss").hour();
  const endMomentHour = moment(endTime, "HH:mm:ss").hour();
  const disabledHours: number[] = [];
  for (let i = 0; i < 24; i++) {
    if (i < startMomentHour || i > endMomentHour) {
      disabledHours.push(i);
    }
  }
  return disabledHours;
}

export function getDisabledDaysBeforeCurrent(current: moment.Moment) {
  return current && current < moment().add(1, "days").endOf("day");
}
