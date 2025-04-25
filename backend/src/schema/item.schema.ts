import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true })
export class Item {
  @Prop({ required: true, maxlength: 40, minlength: 2 })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: false })
  comment: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
