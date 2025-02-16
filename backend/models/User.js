const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let userSchema = new Schema(
  {
    username: { type: String, unique: true, lowercase: true },
    email: { type: String, unique: true },
    password: { type: String, minlength: 6 },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
});

userSchema.methods.verifyPassword = async function (password) {
  let result = await bcrypt.compare(password, this.password);
  return result;
};

userSchema.methods.signToken = async function () {
  let payload = {
    username: this.username,
    email: this.email,
    id: this.id,
  };
  let token = jwt.sign(payload, process.env.SECRET);
  return token;
};

userSchema.methods.userJSON = function (token) {
  return {
    id: this.id,
    email: this.email,
    username: this.username,
    token: token,
  };
};

module.exports = mongoose.model('User', userSchema);
