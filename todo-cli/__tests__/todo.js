/* eslint-disable no-undef */
const todoList = require("../todo");
const { all, markAsComplete, add, overdue, dueLater, dueToday } = todoList();

describe("Todolist Test Suite", () => {
  beforeAll(() => {
    //  add({
    //  title: "Test todo",
    // completed: false,
    // duDate: new Date().toISOString().slice(0, 10),
    //});
  });
  test("Should add new todo", () => {
    const todoItemsCount = all.length;
    add({
      title: "Test todo",
      completed: false,
      duDate: new Date().toISOString().slice(0, 10),
    });
    expect(all.length).toBe(todoItemsCount + 1);
  });
  test("Should mark a todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  //overdue
  test("Should checks retrieval of overdue items.", () => {
    let overdueList = overdue();

    expect(
      overdueList.every((event) => {
        return event.dueDate < formattedDate(new Date());
      })
    ).toBe(true);
  });

  // duetoday
  test("Should checks retrieval of due today items", () => {
    let dueTodaylist = dueToday();
    expect(
      dueTodaylist.every((event) => {
        return event.dueDate === formattedDate(new Date());
      })
    ).toBe(true);
  });

  // duelater
  test("Should checks retrieval of due later items", () => {
    let dueLaterlist = dueLater();
    expect(
      dueLaterlist.every((event) => {
        return event.dueDate > formattedDate(new Date());
      })
    ).toBe(true);
  });
});
