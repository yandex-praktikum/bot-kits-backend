import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import { BotTemplate, BotTemplateDocument } from "./schema/bot-template.schema";
import { Error, Model } from "mongoose";
import BotTemplateDto from "./dto/bot-template.dto";

@Injectable()
export class BotTemplatesService {
    constructor(@InjectModel(BotTemplate.name) private readonly botTemplateModel: Model<BotTemplate>) {
    }

    async create(updateDtoRequest: BotTemplateDto) {
        const botTemplate = await this.botTemplateModel.create(updateDtoRequest);
        const savedBotTemplate = await botTemplate.save();
        return {...savedBotTemplate.toJSON(), _id: savedBotTemplate.id};
    }

    async update(id: string, updateDtoRequest: BotTemplateDto) {
        try {
            const result = await this.botTemplateModel.findByIdAndUpdate(id, updateDtoRequest, { new: true }).exec();
            if (!result) throw new NotFoundException();
            return { ...result.toJSON(), _id: result.id }
        } catch (e) {
            if (e instanceof Error.CastError) throw new BadRequestException("Invalid resource id");
            throw e;
        }
    }

    async findAll() {
        return (await this.botTemplateModel.find().exec()).flatMap(it => ({...it.toJSON(), _id: it.id}));
    }

    async findById(id: string) {
        try {
            const result: BotTemplateDocument = await this.botTemplateModel.findById(id).exec();
            if (!result) throw new NotFoundException();
            return { ...result.toJSON(), _id: result.id }
        } catch (e) {
            if (e instanceof Error.CastError) throw new BadRequestException("Invalid resource id");
            throw e;
        }
    }
}
