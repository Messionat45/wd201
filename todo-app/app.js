const express = require("express");
var csrf = require("tiny-csrf");
const app = express();
const { Todo, User } = require("./models");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const path = require("path");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
//const { next } = require("cheerio/lib/api/traversing");

const saltRounds = 10;

app.use(
  session({
    secret: "my-super-secret-key-21728172615261562",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, //24 hrs
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username } })

        .then(async (user) => {
          const result = await bcrypt.compare(password, user.password); //user.password  is a hashed password
          if (result) {
            return done(null, user);
          } else {
            return done("Invalid Password");
          }
        })
        .catch((error) => {
          return error;
        });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serializing user in ession", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (request, response) => {
  response.render("index", {
    title: "Todo application",

    csrfToken: request.csrfToken(),
  });
});

app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    const overdue = await Todo.overdue();
    const dueToday = await Todo.dueToday();
    const dueLater = await Todo.dueLater();
    const allTodos = await Todo.getTodos();
    const completed = await Todo.completed();
    if (request.accepts("html")) {
      response.render("todos", {
        overdue,
        dueToday,
        dueLater,
        allTodos,
        completed,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({
        overdue,
        dueToday,
        dueLater,
        allTodos,
        completed,
      });
    }
  }
);

app.get("/signup", (request, response) => {
  response.render("signup", {
    title: "Signup",
    csrfToken: request.csrfToken(),
  });
});

app.post("/users", async (request, response) => {
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
  console.log(hashedPwd);
  console.log("Firstname", request.body.firstName);
  try {
    const user = await User.create({
      firstName: request.body.firstName,
      lastname: request.body.lstName,
      email: request.body.email,
      password: hashedPwd,
    });
    request.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      response.redirect("/todos");
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/login", (request, response) => {
  response.render("login", { title: "Login", csrfToken: request.csrfToken() });
});

app.post(
  "/session",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (request, response) => {
    console.log(request.user);
    response.redirect("/todos");
  }
);

app.get("/signout", (request, response, next) => {
  //signout
  request.logout((err) => {
    if (err) {
      return next(err);
    }
    response.redirect("/");
  });
});
//app.use(express, static(path.join(__dirname, "public")));

//app.get("/", function (request, response) {
//  response.send("Hello World");
//});
//-------------------------------------------------------------------------------------------20/5/23
// app.get("/todos", async function (_request, response) {
//   console.log("Processing list of all Todos ...");
//   // FILL IN YOUR CODE HERE
//   // Find all users
//   try {
//     const todo = await Todo.findAll();
//     console.log(todo.every((todoitem) => todoitem instanceof Todo)); // true
//     console.log("All todos:", JSON.stringify(todo, null, 2));
//     return response.json(todo);
//   } catch (error) {
//     console.log(error);
//     return response.status(422).json(error);
//   }
//   // First, we have to query our PostgerSQL database using Sequelize to get list of all Todos.

//   // Then, we have to respond with all Todos, like:
//   // response.send(todos)
// });
//-------------------------------------------------------------------------------------

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    console.log("Creating a todo", request.body);
    try {
      await Todo.addTodo({
        title: request.body.title,
        dueDate: request.body.dueDate,
      });
      return response.redirect("/");
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

///--------------------------------------------------------------------

//-----------------------------------------------------------------

// app.put("/todos/:id/markAsCompleted", async function (request, response) {
//   console.log("We have to update a Todo with ID: ", request.params.id);
//   const todo = await Todo.findByPk(request.params.id);
//   try {
//     const updatedTodo = await todo.markAsCompleted();
//     return response.json(updatedTodo);
//   } catch (error) {
//     console.log(error);
//     return response.status(422).json(error);
//   }
// });

//---------------------5th condition---------------------------------------------------
app.put(
  "/todos/:id/",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    console.log("We have to update a Todo with ID: ", request.params.id);
    const todo = await Todo.findByPk(request.params.id);
    try {
      const updatedTodo = await todo.setCompletionStatus(
        request.body.completed
      );
      return response.json(updatedTodo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

//---------------------------------------------------------------------------------

app.delete(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    console.log("We have to delete a Todo with ID: ", request.params.id);
    // FILL IN YOUR CODE HERE

    // First, we have to query our database to delete a Todo by ID.
    // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
    // response.send(true)
    try {
      const todoDel = await Todo.destroy({
        where: {
          id: request.params.id,
        },
      });
      //return responce.JSON(todoel);
      return response.send(todoDel ? true : false);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

module.exports = app;
