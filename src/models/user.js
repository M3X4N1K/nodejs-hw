import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      // required не ставимо, бо заповнимо хуком, якщо не передали
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Видаляємо пароль з об'єкта, коли віддаємо його клієнту
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Хук: якщо username не передали, він буде таким самим, як email
userSchema.pre('save', function (next) {
  if (!this.username) {
    this.username = this.email;
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;