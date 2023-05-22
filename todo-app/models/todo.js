"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Todo.belongsTo(models.User, {
        foreignKey: "userId",
      });
      // define association here
    }

    static addTodo({ title, dueDate, userId }) {
      return this.create({
        title: title,
        dueDate: dueDate,
        completed: false,
        userId,
      });
    }

    static getTodos() {
      return this.findAll();
    }
    //-----------------------------------------------------------------------
    static async overdue(userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
          },
          userId,
          completed: false,
        },
      });
    }

    static async dueToday(userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date(),
          },
          userId,
          completed: false,
        },
      });
    }

    static async dueLater(userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
          userId,
          completed: false,
        },
      });
    }
    static completed(userId) {
      return this.findAll({
        where: {
          completed: true,
        },
        userId,
        order: [["id", "ASC"]],
      });
    }

    setCompletionStatus(bool) {
      return this.update({ completed: bool });
    }

    //------------------------------------------------------------------------------------

    static async remove(id, userId) {
      return this.destroy({
        where: {
          id,
          userId,
        },
      });
    }

    markAsCompleted() {
      return this.update({ completed: true });
    }
  }
  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );

  //--------------------------------------------------
  // const Todo = sequelize.define(
  //   "Todo",
  //   {
  //     title: {
  //       type: DataTypes.STRING,
  //       allowNull: false,
  //     },
  //     dueDate: {
  //       type: DataTypes.DATEONLY,
  //     },
  //     complete: {
  //       type: DataTypes.BOOLEAN,
  //       defaultValue: false,
  //     },
  //   },
  //   {
  //     tableName: "todo",
  //   }
  // );
  return Todo;
};
