import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { baseSchemaOptions } from 'src/utils/baseSchemaOptions';

export type StatisticsDocument = HydratedDocument<Statistics>;

export class Data {
  @IsDate()
  date: Date;

  @IsNumber()
  amountOfBots: number;
}

export class StatsData {
  @IsString()
  @IsOptional()
  platform: string;

  @IsArray()
  data: Data[];

  @IsNumber()
  total: number;
}

@Schema(baseSchemaOptions)
export class Statistics {
  @Prop({ required: true })
  platformStats: StatsData[];

  @Prop({ required: true })
  installedBots: StatsData[];

  @Prop({ required: true })
  connectedBots: StatsData[];
}

export const StatisticsSchema = SchemaFactory.createForClass(Statistics);
