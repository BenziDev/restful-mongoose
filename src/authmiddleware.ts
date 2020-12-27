import expressJwt from 'express-jwt';
import config from 'config';

const authenticate = expressJwt({secret: config.get("secret")});

export default authenticate;