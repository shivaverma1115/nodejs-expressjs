import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../sequelize';

interface CommentAttributes {
  id: number;
  content: string;
  postId: number;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type CommentCreation = Optional<CommentAttributes, 'id'>;

export class Comment extends Model<CommentAttributes, CommentCreation> implements CommentAttributes {
  declare id: number;
  declare content: string;
  declare postId: number;
  declare userId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Comment.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    postId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  {
    sequelize,
    tableName: 'Comments',
    modelName: 'Comment',
    indexes: [{ fields: ['postId'] }, { fields: ['userId'] }],
  },
);
