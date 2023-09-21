import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlacklistTokensDocument = Document & BlacklistTokens;

@Schema({ timestamps: true, collection: 'token_blacklist' })
export class BlacklistTokens {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expirationDate: Date;
}

export const BlacklistTokensSchema =
  SchemaFactory.createForClass(BlacklistTokens);
