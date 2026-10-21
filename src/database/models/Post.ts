import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../sequelize';

interface PostAttributes {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  categoryId: number;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

type PostCreation = Optional<PostAttributes, 'id' | 'imageUrl'>;

export class Post extends Model<PostAttributes, PostCreation> implements PostAttributes {
  declare id: number;
  declare title: string;
  declare content: string;
  declare imageUrl: string | null;
  declare categoryId: number;
  declare userId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

Post.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(191), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    imageUrl: { type: DataTypes.STRING(1024), allowNull: true },
    categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  {
    sequelize,
    tableName: 'Posts',
    modelName: 'Post',
    paranoid: true,
    indexes: [{ fields: ['userId'] }, { fields: ['categoryId'] }, { fields: ['title'] }],
  },
);
