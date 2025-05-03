import { DateTime } from 'luxon';

export function isOutRange(value: number, min: number, max: number): boolean {
  return value < min || value > max;
}
export function isSameDate(
  date1: DateTime<true>,
  date2: DateTime<true>
): boolean {
  return (
    date1.year === date2.year &&
    date1.month === date2.month &&
    date1.day === date2.day
  );
}
export function isSameTimeZone(timezoneA: string, timezoneB: string) {
  const nowA = DateTime.now().setZone(timezoneA);
  const nowB = DateTime.now().setZone(timezoneB);

  const offsetDifference = nowA.offset - nowB.offset;
  return offsetDifference === 0;
}
