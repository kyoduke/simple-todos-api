import HttpException from './HttpException';

class NotValidCredentialsException extends HttpException {
  constructor() {
    super(401, `Incorrect Email or Password.`);
  }
}

export default NotValidCredentialsException;