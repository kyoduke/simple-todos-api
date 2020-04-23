import User from './user.interface';
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (e: string) => validator.isEmail(e),
      message: 'Invalid email address'
    },
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters']
  }
});

userSchema.pre<User>('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const rounds = 10;
  const hash = await bcrypt.hash(this.password, rounds);
  this.password = hash;
  return next();
});

userSchema.path('email').validate(async (e: string) => {
	const user = await userModel.findOne({ email: e });
	if (!user) {
		return true;
	}

	return false;
}, 'This email address is already taken');


const userModel = mongoose.model<User>('User', userSchema);

export default userModel;
