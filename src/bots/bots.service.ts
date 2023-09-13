import {InjectModel} from "@nestjs/mongoose";
import {Bot, BotDocument} from "./schema/bots.schema";
import {Model} from "mongoose";
import {Injectable} from "@nestjs/common";
import {CreateBotDto} from "./dto/create-bot.dto";
import {UpdateBotDto} from "./dto/update-bot.dto";

@Injectable()
export class BotsService {
	constructor(
		@InjectModel(Bot.name) private botModel: Model<BotDocument>,
	) {}

	async create(createBotDto: CreateBotDto): Promise<Bot> {
		return await new this.botModel(createBotDto).save();
	}

	async findOne(id: string): Promise<Bot> {
		return await this.botModel.findById(id).exec();
	}

	async findAllByUser(userId: string): Promise<Bot[] | null> {
		return this.botModel.find({ 'profile': userId });
	}

	async findAll(): Promise<Bot[]> {
		return await this.botModel.find().exec();
	}

	async update(id: string, updateBotDto: UpdateBotDto): Promise<Bot> {
		await this.botModel.findByIdAndUpdate(id, updateBotDto).exec();
		return this.findOne(id);
	}

	async remove(id: string): Promise<Bot> {
		return await this.botModel.findByIdAndRemove(id).exec();
	}
}
