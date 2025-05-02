import { BadRequestException } from '@nestjs/common';
import { DateTime } from 'luxon';
export const NormalizeDate = (date: Date, timezone: string) => {
  const parsedDate = DateTime.fromJSDate(date, { zone: timezone });
  if (!parsedDate.isValid)
    throw new BadRequestException('invalid date:', parsedDate.invalidReason);

  parsedDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  return parsedDate;
};
