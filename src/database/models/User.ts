import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../sequelize';
import { UserRole } from '../../common/constants/roles';

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  googleId: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

type UserCreation = Optional<
  UserAttributes,
  'id' | 'password' | 'role' | 'isEmailVerified' | 'googleId'
>;

export class User extends Model<UserAttributes, UserCreation> implements UserAttributes {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string | null;
  declare role: UserRole;
  declare isEmailVerified: boolean;
  declare googleId: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

User.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(191), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: true },
    role: { type: DataTypes.ENUM('user', 'admin'), allowNull: false, defaultValue: UserRole.USER },
    isEmailVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    googleId: { type: DataTypes.STRING(191), allowNull: true },
  },
  {
    sequelize,
    tableName: 'Users',
    modelName: 'User',
    paranoid: true,
    indexes: [{ unique: true, fields: ['email'] }, { fields: ['googleId'] }],
  },
);
