const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = (process.env.SALT_WORK_FACTOR || 10);

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true }
});

userSchema.methods.cleanup = function () {
  return { id: this._id, email: this.email, name: this.name };
}

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password).catch((e) => false);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const hash = bcrypt.hashSync(this.password, SALT_WORK_FACTOR);
  this.password = hash;

  return next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
  const hash = bcrypt.hashSync(this._update.password, SALT_WORK_FACTOR);
  this._update.password = hash;

  return next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;