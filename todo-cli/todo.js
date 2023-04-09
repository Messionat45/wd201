/* eslint-disable no-undef */
const todoList = () => {
  all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    // Write the date check condition here and return the array
    // of overdue items accordingly.
    let condition1 = [];
    condition1 = all.filter(
      (event) => event.dueDate < formattedDate(new Date())
    );
    return condition1;
  };

  const dueToday = () => {
    // Write the date check condition here and return the array
    // of todo items that are due today accordingly.
    let condition2 = [];
    condition2 = all.filter(
      (event) => event.dueDate === formattedDate(new Date())
    );
    return condition2;
  };

  const dueLater = () => {
    // Write the date check condition here and return the array
    // of todo items that are due later accordingly.
    let condition3 = [];
    condition3 = all.filter(
      (event) => event.dueDate > formattedDate(new Date())
    );
    return condition3;
  };

  const toDisplayableList = (list) => {
    // Format the To-Do list here, and return the output string
    // as per the format given above.
    return list
      .map(
        (todo) =>
          `[${todo.completed ? "x" : " "}] ${todo.title} ${
            todo.dueDate !== formattedDate(new Date()) ? todo.dueDate : ""
          }`
      )
      .join("\n")
      .trim();
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};
module.exports = todoList;
