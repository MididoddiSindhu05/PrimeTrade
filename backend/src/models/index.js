const { Sequelize } = require('sequelize');
const UserModel = require('./user');
const TaskModel = require('./task');

const dialect = process.env.DB_DIALECT || 'postgres';

const sequelize = dialect === 'sqlite'
  ? new Sequelize({ dialect: 'sqlite', storage: 'database.sqlite', logging: false })
  : new Sequelize(process.env.DATABASE_URL, { dialect, logging: false });

const User = UserModel(sequelize);
const Task = TaskModel(sequelize);

User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

module.exports = { sequelize, User, Task };
