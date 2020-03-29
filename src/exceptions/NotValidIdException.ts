/*
	Use this instead of TodoNotFoundException for mongoose CastErrors? 
*/

import HttpException from './HttpException';

class NotValidIdException extends HttpException {
  constructor(id: string) {
    super(404, `${id} is not a valid ID string`);
  }
}

// export default NotValidIdException;
