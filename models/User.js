const sequelize = require('../db');
const { Sequelize, Model } = require('sequelize');
const { compare, hash } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

// class User extends Model {
//   static async find_by_email_and_password(user_email, password) {
//     try {
//       const user = await User.findOne({
//         where: {
//           user_email,
//         },
//       });
//       if (!user) throw new Error('Incorrect Credentials');
//       const isMatched = await compare(password, user.user_password);
//       if (!isMatched) throw new Error('Incorrect Credentials');
//       return user;
//     } catch (err) {
//       throw err;
//     }
//   }
//   static async find_by_email(user_email) {
//     try {
//       let temp1 = await User.findOne({
//         where: { user_email },
//       });
//       if (!temp1) throw new Error('email not found');
//       else {
//         return temp1;
//       }
//     } catch (err) {
//       err.name = 'AuthError';
//       throw err;
//     }
//   }

//   static async find_user_by_id(user_id) {
//     try {
//       const user = await User.findOne({
//         where: {
//           user_id,
//         },
//       });
//       return user;
//     } catch (err) {
//       console.log(err.message);
//     }
//   }

//   //-----------------------------------------------------------logic to delete user by token
//   static async delete_user_by_id(id) {
//     try {
//       const user = await User.findOne({ where: { user_id: id } });
//       user.destroy();
//       return user;
//     } catch (err) {
//       console.log(err.message);
//     }
//   }
//   //-------------------------------------------------------------------end
// }

const userSchema = {
  user_id: {
    type: Sequelize.TEXT,
    primaryKey: true,
    unique: true,
  },
  user_name: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  user_email: {
    type: Sequelize.TEXT,
    allowNull: false,
    unique: true,
  },
  user_password: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  user_image: {
    type: Sequelize.TEXT,
  },
  totle_orders: {
    type: Sequelize.INTEGER,
  },
  last_login: {
    type: Sequelize.DATE,
  },
};
// User.init(userSchema, {
//   sequelize,
//   tableName: 'users',
// });

const User = sequelize.define(
  'users',
  {
    user_id: {
      type: Sequelize.TEXT,
      primaryKey: true,
      unique: true,
    },
    user_name: {
      type: Sequelize.TEXT,
    },
    user_email: {
      type: Sequelize.TEXT,
    },
    user_password: {
      type: Sequelize.TEXT,
    },
    last_login: {
      type: Sequelize.DATE,
    },
    total_orders: {
      type: Sequelize.INTEGER,
    },
    user_image: {
      type: Sequelize.TEXT,
    },
  },
  {
    timestamps: false,
  }
);

User.beforeCreate(async (user) => {
  const hashedPassword = await hash(user.user_password, 10);
  user.user_password = hashedPassword;
});

User.beforeUpdate(async (user) => {
  if (user.changed('user_password')) {
    const hashedPassword = await hash(user.user_password, 10);
    user.user_password = hashedPassword;
  }
});
module.exports = User;
