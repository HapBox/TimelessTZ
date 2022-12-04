import { Token } from 'src/database/models/final/token.model';
import { Constants, ErrorReasons } from 'src/utils/constants';
import { throwErrorSimple } from 'src/utils/utils-errors';

export const requireToken = async (request, reply, next) => {
  const accessToken = request.headers[Constants.HEADER_X_ACCESS_TOKEN] as string;

  if (!accessToken) {
    throwErrorSimple('Token not send', 400);
  }

  const token = await Token.findOne({
    where: {
      token: accessToken,
    },
  });

  if (!token) throwErrorSimple('Incorrect token', 401);

  request.userLogin = token.userLogin;

  next();
};
