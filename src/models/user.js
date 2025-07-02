import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Status } from "../constants/index.js";
import { Task } from "./task.js";
import { encriptar } from "../common/bcrypt.js";
import logger from "../logs/logger.js";

export const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull:{
        msg: "El nombre de usuario es obligatorio"
      },
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "La contraseña es obligatoria"
      },
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: Status.ACTIVE,
    validate: {
      isIn: {
        args: [[Status.ACTIVE, Status.INACTIVE]],
        msg: `El estado debe ser ${Status.ACTIVE} o ${Status.INACTIVE}`
      }
    }
  }
});

User.hasMany(Task)
Task.belongsTo(User)

 User.beforeCreate(async (user) => {
   try {
     user.password = await encriptar(user.password);
   } catch (error) {
     throw new Error('Error al encriptar la contraseña');
   }
 });
 User.beforeUpdate(async (user) => {
   console.log('entroooo')
   try {
     user.password = await encriptar(user.password);
   } catch (error) {
     logger.error(error.message);
     throw new Error('Error al encriptar la contraseña');
   }
 }
 );
