/* eslint-disable no-undef */
const todoList = require("../todo");
const { all, markAsComplete, add, overdue, dueLater, dueToday } = todoList();

describe("Todolist Test Suite", () => {
  beforeAll(() => {
    add({
      title: "Test todo",
      completed: false,
      duDate: new Date().toISOString().slice(0, 10),
    });
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

  //overdue new
  test("Should checks retrieval of overdue items.", () => {
    let overdueItemcount = overdue().length;
    add({
      title: "overdue todo ",
      completed: false,
      dueDate: new Date("2023-04-01").toISOString().split(0, 10),
    });
    let newOverdueItemCount = overdue().length;
    expect(newOverdueItemCount).toBe(overdueItemcount + 1);
  });

  //overdue
  //test("Should checks retrieval of overdue items.", () => {--------------------------------
  //let overdueList = overdue();

  //expect(
  //  overdueList.every((event) => {
  //    return event.dueDate < formattedDate(new Date());
  //   })
  //  ).toBe(true);
  // });------------------------------------------------------------

  //due today new
  test("Should checks retrieval of due today items", () => {
    let dueTodayItemCount = dueToday().length;
    add({
      title: "due today todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    let newDueTodayItemCount = dueToday().length;
    expect(newDueTodayItemCount).toBe(dueTodayItemCount + 1);
  });
  // duetoday
  // test("Should checks retrieval of due today items", () => {--------------------------------
  //   let dueTodaylist = dueToday();
  //   expect(
  //     dueTodaylist.every((event) => {
  //       return event.dueDate === formattedDate(new Date());
  //    })
  //   ).toBe(true);
  // });----------------------------------------------------------------

  //due later new
  test("Should checks retrieval of due later items", () => {
    dueLaterItemCount = dueLater().length;
    add({
      title: "upoming todo",
      completed: false,
      dueDate: new Date("2023-05-01").toISOString().slice(0, 10),
    });
    newDueLaterItemCount = dueLater().length;
    expect(newDueLaterItemCount).toBe(dueLaterItemCount + 1);
  });
  // duelater
  // test("Should checks retrieval of due later items", () => {-----------------------------------
  // let dueLaterlist = dueLater();
  //expect(
  // dueLaterlist.every((event) => {
  //  return event.dueDate > formattedDate(new Date());
  //})
  //).toBe(true);
  //});---------------------------------------------------------------------
});
