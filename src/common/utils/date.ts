import {
  NearestMinutes,
  add,
  format,
  isAfter,
  isBefore,
  isSameHour,
  isSameMinute,
  isSunday,
  isSameMonth,
  isValid,
  parse,
  parseISO,
  roundToNearestMinutes,
  sub,
  startOfDay,
  endOfDay,
  intervalToDuration,
  differenceInMinutes,
  startOfMonth,
  lastDayOfMonth,
  endOfMonth,
} from "date-fns";
import { setDefaultOptions } from "date-fns";
import { fr } from "date-fns/locale";
setDefaultOptions({ locale: fr });

/**
 * Convert minutes to hours as human readable (ex: 143 minutes => 2h23)
 *
 * @param minutes
 * @returns
 */
const minutesToHoursHr = (minutes) => {
  // convert minutes to hours
  const hours = Math.floor(minutes / 60);
  // get remaining time
  const minRemaining = minutes % 60;

  return `${hours}h${minRemaining ? minRemaining : ""}`;
};

/**
 * Generate intervals between startTime and endTime to nearest minutes (each 30 minutes)
 *
 * @param startTime
 * @param endTime
 * @param nearestTo Nearest minutes (ex: each 15 minutes)
 * @example [ "08:00", "08:30", "09:00", "09:30", "10:00", "10:30" ]
 */
const eachTimeOfInterval = (
  startTime: Date,
  endTime: Date,
  nearestTo: NearestMinutes = 30
): string[] => {
  const output: string[] = [];
  let start = startTime;
  const end = endTime;

  // --------------------------------
  // add the first interval
  // --------------------------------
  output.push(start.toISOString());

  // --------------------------------
  // add the other intervals
  // --------------------------------
  while (
    isBefore(start, end) ||
    (isSameHour(start, end) && isSameMinute(start, end))
  ) {
    // round the start time to the nearest quarter minutes
    const roundedToQuarterMinutes = roundToNearestMinutes(start, {
      nearestTo: nearestTo,
    });

    // verify if the interval is not already in the output
    if (output.includes(roundedToQuarterMinutes.toISOString()) === false) {
      // add the interval to the output
      output.push(roundedToQuarterMinutes.toISOString());
    }

    // increment the start time
    start = add(roundedToQuarterMinutes, { minutes: nearestTo });
  }

  return output;
};

/**
 * Count number of business hours between two dates
 */
const countWeekdayMinutes = ({ startDate, endDate }) => {
  let weekdayMinutes = 0;
  let actualDate = startDate;

  while (isBefore(actualDate, endDate)) {
    if (!isSunday(actualDate)) {
      const hourOfDay = actualDate.getHours();

      // In UTC time, 4h (UTC) is 5h in Paris (UTC+1)
      // In UTC time, 22h (UTC) is 23h in Paris (UTC+1)
      if (hourOfDay >= 4 && hourOfDay < 22) {
        weekdayMinutes++;
      }
    }

    actualDate = add(actualDate, { minutes: 1 });
  }

  return weekdayMinutes;
};

/**
 * Count number of night minutes between two dates
 */
const countNightMinutes = ({ startDate, endDate }) => {
  let nightMinutes = 0;
  let actualDate = startDate;

  while (isBefore(actualDate, endDate)) {
    if (!isSunday(actualDate)) {
      const hourOfDay = actualDate.getHours();

      // In UTC time, 4h (UTC) is 5h in Paris (UTC+1)
      // In UTC time, 22h (UTC) is 23h in Paris (UTC+1)
      if (hourOfDay >= 22 || hourOfDay < 4) {
        nightMinutes++;
      }
    }

    actualDate = add(actualDate, { minutes: 1 });
  }

  return nightMinutes;
};

/**
 * Count number of sunday (dimanche) minutes between two dates
 */
const countSundayHolidayMinutes = ({ startDate, endDate }) => {
  let sundayHolidayMinutes = 0;
  let actualDate = startDate;

  while (isBefore(actualDate, endDate)) {
    if (isSunday(actualDate)) {
      sundayHolidayMinutes++;
    }

    actualDate = add(actualDate, { minutes: 1 });
  }

  return sundayHolidayMinutes;
};

export const dateUtils = {
  add,
  sub,
  format,
  isBefore,
  isAfter,
  isSameHour,
  isSameMinute,
  roundToNearestMinutes,
  parse,
  parseISO,
  isValid,
  startOfDay,
  endOfDay,
  intervalToDuration,
  differenceInMinutes,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  lastDayOfMonth,

  // custom functions
  minutesToHoursHr,
  eachTimeOfInterval,
  countWeekdayMinutes,
  countNightMinutes,
  countSundayHolidayMinutes,
};
