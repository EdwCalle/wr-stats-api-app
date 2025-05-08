import { BadRequestException } from '@nestjs/common';
import { DateTime } from 'luxon';
export const NormalizeDate = (date: Date, timezone: string, key = 'date') => {
  const parsedDate = DateTime.fromJSDate(date, { zone: timezone });
  if (!parsedDate.isValid)
    throw new BadRequestException(`invalid ${key}`, parsedDate.invalidReason);

  const normalizedDate = parsedDate.set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
  });
  return normalizedDate;
};
