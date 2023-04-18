"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE
      const overdueList = await Todo.overdue();
      const ODItems = overdueList
        .map((todo) => todo.displayableString())
        .join("\n");
      console.log(ODItems);
      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      const DueTodayList = await Todo.dueToday();
      const DTItems = DueTodayList.map((todo) => todo.displayableString()).join(
        "\n"
      );
      console.log(DTItems);
      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const DueLaterList = await Todo.dueLater();
      const DLItems = DueLaterList.map((todo) => todo.displayableString()).join(
        "\n"
      );
      console.log(DLItems);
    }

    //------------------------------------------------------
    static async overdue() {
      const { Op } = require("sequelize");
      const todos = await Todo.findAll({
        where: {
          dueDate: { [Op.lt]: new Date() },
        },
        order: [["id", "ASC"]],
      });
      return todos;
      // FILL IN HERE TO RETURN OVERDUE ITEMS
    }

    static async dueToday() {
      const { Op } = require("sequelize");
      const todos = await Todo.findAll({
        where: {
          dueDate: { [Op.eq]: new Date() },
        },
        order: [["id", "ASC"]],
      });
      return todos;
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
    }

    static async dueLater() {
      const { Op } = require("sequelize");
      const todos = await Todo.findAll({
        where: {
          dueDate: { [Op.gt]: new Date() },
        },
        order: [["id", "ASC"]],
      });
      return todos;
      // FILL IN HERE TO RETURN ITEMS DUE LATER
    }

    static async markAsComplete(id) {
      const todos = Todo.update(
        { completed: true },
        {
          where: {
            id: id,
          },
        }
      );
      return todos;
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
    }
    ///----------------------------------------------------
    ///-------------------------------------------------------

    //-------------------------------------------
    // static associate(models) {
    // define association here
    //}
    //--------------------------------------------

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${
        this.dueDate.toString() === new Date().toISOString().slice(0, 10)
          ? ""
          : this.dueDate
      }`.trim();
    }

    //------------------------------------------------------------------my extra edit
    // todaydisplayableString() {
    //  let checkbox = this.completed ? "[x]" : "[ ]";
    //  return `${this.id}. ${checkbox} ${this.title}`;
    //}

    //------------------------------------------------------------------------------------
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
