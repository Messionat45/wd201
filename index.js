const { connect } = require("./connectDB.js");
const Todo = require("./TodoModel.js");

const createTodo = async () => {
  try {
    await connect();
    const todo = await Todo.addTask({
      title: "Fourth Time",
      dueDate: new Date(),
      completed: false,
    });
    console.log(`Created Todo with ID : ${todo.id}`);
  } catch (error) {
    console.error(error);
  }
};
(async () => {
  await createTodo();
})();
