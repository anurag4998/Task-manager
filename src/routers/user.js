const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();
const User = require("../models/user");
const multer = require("multer");
const { sendWelcomeEmail, sendCancelEmail } = require("../emails/account")

router.post("/users", async (req, resp) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken();

    resp.status(201).send({ user, token });
  } catch (e) {
    resp.status(400).send(e);
  }
  // user.save().then(() => {
  //     resp.status(201).send(user)
  // }).catch((e) => {
  //     resp.status(400).send(e)
  //     // resp.send(e)
  // })
});
///////////////////////////////////////////////////////////////////////////
router.post("/users/login", async (req, resp) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    resp.send({ user, token });
  } catch (e) {
    resp.status(400).send();
  }
});
///////////////////////////////////////////////////////////////////////////
router.post("/users/logout", auth, async (req, resp) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    resp.send();

  } catch (e) {
    resp.status(500).send();
  }
});
///////////////////////////////////////////////////////////

router.post("/users/logoutall", auth, async (req, resp) => {
  try {
    req.user.tokens = []
    await req.user.save()
    resp.send();

  }
  catch (e) {
    resp.status(500).send();
  }
});
///////////////////////////////////////////////////////////
router.get("/users/me", auth, async (req, resp) => {

  resp.send(req.user)
  // try {
  //   const user = await User.find({});
  //   resp.status(200).send(user);
  // } catch (e) {
  //   resp.status(500).send();
  // }
  // User.find({}).then((users) => {
  //     resp.status(200).send(users)
  // }).catch((e) => {
  //     resp.status(500).send()
  // })
});

///////////////////////////////////////////////////////////////////////////

router.patch("/users/me", auth, async (req, resp) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return resp.status(400).send({ error: " Invalid Updates" });

  // const _id = req.params.id;
  try {
    // const user = await User.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true,
    // }); bypassses mongoose and performs direct operation on db

    // const user = await User.findById(_id);   -> user can only update themselves and not any other user 

    // if (!user) {
    //   return resp.status(404).send();
    // }
    //to run middleware
    updates.forEach((updates) => (req.user[updates] = req.body[updates]));
    await req.user.save();

    resp.status(200).send(req.user);
  } catch (e) {
    resp.status(400).send(e);
  }
});
///////////////////////////////////////////////////////////////////////////

router.delete("/users/me", auth, async (req, resp) => {

  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // if (!user) {
    //   return resp.status(404).send({ error: " No such user" });
    // }
    sendCancelEmail(req.user.email, req.user.name)
    await req.user.remove()
    resp.send(req.user);
  } catch (e) {
    resp.status(500).send();
  }
});
////////////////////////////////////////////////////////////////////////////////////

const upload = multer({
  limits: {
    fileSize: 3000000,

  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
      return cb(new Error("Please upload a valid image format (jpg,jpeg or png)"))

    cb(undefined, true)
  }
})
router.post("/users/me/avatar", auth, upload.single("avatar"), async (req, resp) => {
  req.user.avatar = req.file.buffer
  await req.user.save()
  resp.send()
}, (error, req, resp, next) => {
  resp.status(400).send({ error: error.message })
})

////////////////////////////////////////////////////////////////////////////////////

router.delete("/users/me/avatar", auth, upload.single("avatar"), async (req, resp) => {
  req.user.avatar = undefined
  await req.user.save()
  resp.send()
})
////////////////////////////////////////////////////////////////////////////////////
router.get("/users/:id/avatar", async (req, resp) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user || !user.avatar)
      throw new Error()


  }

  catch (e) {
    resp.status(404).send()
  }
})
////////////////////////////////////////////////////////////////////////////////////

module.exports = router;
