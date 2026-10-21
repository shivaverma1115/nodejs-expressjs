import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../sequelize';

interface PasswordResetTokenAttributes {
  id: number;
  userId: number;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type PasswordResetTokenCreation = Optional<PasswordResetTokenAttributes, 'id' | 'usedAt'>;

export class PasswordResetToken
  extends Model<PasswordResetTokenAttributes, PasswordResetTokenCreation>
  implements PasswordResetTokenAttributes
{
  declare id: number;
  declare userId: number;
  declare tokenHash: string;
  declare expiresAt: Date;
  declare usedAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PasswordResetToken.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    tokenHash: { type: DataTypes.STRING(64), allowNull: false, unique: true },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    usedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: 'PasswordResetTokens',
    modelName: 'PasswordResetToken',
    indexes: [{ fields: ['userId'] }],
  },
);
