import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from "mongoose";

export type BotTemplateDocument = HydratedDocument<BotTemplate>;

@Schema({timestamps: true, collection: "bot_templates"})
export class BotTemplate {
    @Prop()
    icon: string;

    @Prop({isRequired: true})
    title: string;

    @Prop({default: 'none'})
    description: string;

    @Prop([String])
    features: string[]

    @Prop({type: Object})
    settings: Object
}

export const BotTemplateSchema = SchemaFactory.createForClass(BotTemplate);
