const jwt = require('jsonwebtoken');

module.exports = {
  verifyToken: (req, res, next) => {
    const token = req.headers.authorization;
    // console.log(token);

    if (!token) {
      return res
        .status(401)
        .json({ msg: 'No Token Provided, Authorization Denied!' });
    }

    try {
      let verified = jwt.verify(token, process.env.SECRET);
      req.user = verified;
      req.user.token = token;

      return next();
    } catch (error) {
      res.status(401).json({ msg: error.msg || error });
    }
  },
};
