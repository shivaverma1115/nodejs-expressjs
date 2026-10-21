import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../sequelize';

interface RefreshTokenAttributes {
  id: number;
  userId: number;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type RefreshTokenCreation = Optional<RefreshTokenAttributes, 'id' | 'revokedAt'>;

export class RefreshToken
  extends Model<RefreshTokenAttributes, RefreshTokenCreation>
  implements RefreshTokenAttributes
{
  declare id: number;
  declare userId: number;
  declare tokenHash: string;
  declare expiresAt: Date;
  declare revokedAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

RefreshToken.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    tokenHash: { type: DataTypes.STRING(64), allowNull: false, unique: true },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    revokedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: 'RefreshTokens',
    modelName: 'RefreshToken',
    indexes: [{ fields: ['userId'] }],
  },
);
