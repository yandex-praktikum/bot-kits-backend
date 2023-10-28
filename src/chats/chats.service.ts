import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './schema/chat.schema';
import { Model } from 'mongoose';

@Injectable()
export class ChatsService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async create(createChatDto: CreateChatDto) {
    const chat = new this.chatModel(createChatDto);
    return await chat.save();
  }

  async findChatsForUser(userId: string): Promise<Chat[]> {
    return this.chatModel
      .find({
        $or: [{ sender: userId }, { recipient: userId }],
      })
      .exec();
  }

  async findChatHistory(user1Id: string, user2Id: string): Promise<Chat[]> {
    return this.chatModel
      .find({
        $or: [
          { sender: user1Id, recipient: user2Id },
          { sender: user2Id, recipient: user1Id },
        ],
      })
      .sort({ createdAt: 1 })
      .exec();
  }

  async findAll(): Promise<Chat[]> {
    return await this.chatModel.find();
  }

  async findLastNMessage(n: number): Promise<Chat[]> {
    return this.chatModel.find().sort({ _id: -1 }).limit(n).exec();
  }

  async findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  async update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  async remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
