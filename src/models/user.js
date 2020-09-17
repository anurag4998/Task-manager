const mongoose = require("mongoose");
const validator = require("validator");
const brcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Tasks = require("./tasks");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    default: 0,
    Validate(value) {
      if (value < 0) throw new Error("Age must be positive");
    }
  },

  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    Validate(value) {
      if (!validator.isEmail(value)) throw new Error("Email INVALID");
    }
  },

  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password"))
        throw new Error("Password can not have the word password in it");
    }
  },
  avatar: {
    type: Buffer
  },
  tokens: [{

    token: {
      type: String,
      required: true
    }

  }]
}, {
  timestamps: true
});

///////////////////////////////////////////////////////////////////////////////
userSchema.virtual("tasks"), {
  ref: "Tasks",
  localfield: "_id",
  foreignfield: "owner"
}


// ////////////////////////////////////////////////////////////////
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET_KEY);
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token;
};

////////////////////////////////////////////////////////////////////////////////
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject()
  delete userObject.password
  delete userObject.tokens

  return userObject
};
//////////////////////////////////////////////////////////
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("unable to login");
  }

  const ismatch = await brcypt.compare(password, user.password);

  if (!ismatch) {
    throw new Error("Unable to login");
  }

  return user;
};

//////////////////////////////////////////////////////////////////////////////////
//hash plain text pwd
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await brcypt.hash(user.password, 8);
  }
  // next();
});

////////////////////////////////////////////////////////////////////////////////////
userSchema.pre("remove", async function (next) {
  const user = this;
  await Tasks.deleteMany({ owner: user._id })
})
////////////////////////////////////////////////////////////////////////////////////


const User = mongoose.model("User", userSchema);

module.exports = User;
