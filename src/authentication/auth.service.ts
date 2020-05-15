import userModel from '../user/user.model';
import TokenData from '../interfaces/tokenData.interface';
import User from '../user/user.interface';
import jwt from 'jsonwebtoken';
import env from '../utils/cleanedEnv';

class AuthenticationService {
  public createToken(user: User): TokenData {
    const payload = { _id: user._id };
    const expiresIn = 60 * 60 * 24 * 60;

    const secret = env.JWT_SECRET;
    return { expiresIn, token: jwt.sign(payload, secret, { expiresIn }) };
  }
}

export default AuthenticationService;
