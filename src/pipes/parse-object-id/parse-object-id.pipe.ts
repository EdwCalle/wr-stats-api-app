import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  // transform(value: string): Types.ObjectId {
  transform(value: string): string {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(
        `ParseObjectID error: Invalid ID format: ${value}`
      );
    }
    // return new Types.ObjectId(value);
    return value;
  }
}
