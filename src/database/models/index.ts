import { User } from './User';
import { Category } from './Category';
import { Post } from './Post';
import { Comment } from './Comment';
import { RefreshToken } from './RefreshToken';
import { PasswordResetToken } from './PasswordResetToken';

User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });

Category.hasMany(Post, { foreignKey: 'categoryId', as: 'posts' });
Post.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(PasswordResetToken, { foreignKey: 'userId', as: 'passwordResetTokens' });
PasswordResetToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export const models = {
  User,
  Category,
  Post,
  Comment,
  RefreshToken,
  PasswordResetToken,
};

export { User, Category, Post, Comment, RefreshToken, PasswordResetToken };
