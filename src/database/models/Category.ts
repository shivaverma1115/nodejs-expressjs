import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../sequelize';

interface CategoryAttributes {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type CategoryCreation = Optional<CategoryAttributes, 'id'>;

export class Category extends Model<CategoryAttributes, CategoryCreation> implements CategoryAttributes {
  declare id: number;
  declare name: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Category.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false, unique: true },
  },
  {
    sequelize,
    tableName: 'Categories',
    modelName: 'Category',
  },
);
