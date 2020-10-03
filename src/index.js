const express = require("express");
var cors = require('cors')

require("./db/mongoose");

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT;
app.use(cors({
  origin: ['http://localhost:3000', 'https://awesome-franklin-957d1e.netlify.app/'],
  credentials: true
}));
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
  console.log("server is up on port" + port)
});
