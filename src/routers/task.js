const express = require("express");
const router = new express.Router();
const Tasks = require("../models/tasks");
const auth = require("../middleware/auth");

router.post("/tasks", auth, async (req, resp) => {
  const task = new Tasks({
    ...req.body,
    owner: req.user._id
  })
  try {
    await task.save();
    resp.status(201).send(task);
  } catch (e) {
    resp.status(400).send(e);
  }
});
///////////////////////////////////////////////////////////////////
router.get("/tasks", auth, async (req, resp) => {
  try {
    const completed = req.query.completed ? req.query.completed : undefined
    const limit = req.query.limit ? req.query.limit : undefined
    const skip = req.query.skip ? req.query.skip : 0

    //await req.user.populate(tasks).execPopulate()
    let tasks = await Tasks.find({ owner: req.user._id });;
    if (completed)
      tasks = await Tasks.find({ owner: req.user._id, completed });


    if (req.query.sortBy) {
      const part = req.query.sortBy.split(":")
      let searchterm = part[0]
      part[1] = part[1] == "desc" ? -1 : 1
      if (searchterm == "createdAt")
        tasks = await Tasks.find({}).sort({ _id: part[1] })
      if (searchterm == "completed")
        tasks = await Tasks.find({}).sort({ completed: part[1] })
    }

    if (completed && req.query.sortBy) {
      const part = req.query.sortBy.split(":")
      let searchterm = part[0]
      part[1] = part[1] == "desc" ? -1 : 1

      if (searchterm == "createdAt")
        tasks = await Tasks.find({ completed }).sort({ _id: part[1], })
      if (searchterm == "completed")
        tasks = await Tasks.find({ completed }).sort({ completed: part[1] })
    }

    // if (!limit)
    //   return resp.status(200).send(tasks);

    if (limit) {
      tasks = tasks.splice(skip * limit, skip * limit + limit)
    }
    resp.status(200).send(tasks);
  } catch (e) {
    resp.status(500).send();
  }
});

/////////////////////////////////////////////////////////////////
router.get("/tasks/:id", auth, async (req, resp) => {
  const _id = req.params.id;
  try {
    // const tasks = await Tasks.findById(_id);
    const tasks = await Tasks.findOne({ _id, owner: req.user._id });

    if (!tasks) {
      return resp.status(404).send();
    }

    resp.send(tasks);
  } catch (e) {
    resp.status(500).send();
  }
});
///////////////////////////////////////////////////////////////////
router.patch("/tasks/:id", auth, async (req, resp) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["completed", "description"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return resp.status(400).send({ error: " Invalid Updates" });

  const _id = req.params.id;

  try {
    // const task = await Tasks.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
    const task = await Tasks.findOne({ _id, owner: req.user._id });

    if (!task) {
      return resp.status(404).send();
    }

    updates.forEach((updates) => (task[updates] = req.body[updates]));
    await task.save();

    resp.send(task);
  } catch (e) {
    resp.status(400).send(e);
  }
});
//////////////////////////////////////////////////////////////////////////
router.delete("/tasks/:id", auth, async (req, resp) => {
  const _id = req.params.id;

  try {
    const task = await Tasks.findOneAndDelete({ _id, owner: req.user._id });
    if (!task) {
      return resp.status(404).send({ error: " No such task" });
    }

    resp.send(task);
  } catch (e) {
    resp.status(500).send();
  }
});

module.exports = router;
