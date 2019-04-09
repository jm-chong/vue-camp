"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _express = require("express");

var _auth = require("../utils/auth.js");

var _UserModel = _interopRequireDefault(require("../models/UserModel.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// libs
// modules
// import passport from '../passport.js';
// router init
const router = (0, _express.Router)(); // router

router.post('/login', (req, res) => {
  // find the user
  _UserModel.default.findOne({
    username: req.body.username
  }).then(user => {
    // non registered user
    if (!user) {
      res.status(401).send('Authentication failed. User not found.');
    }

    _bcrypt.default.compare(req.body.password, user.password, (error, result) => {
      if (error) {
        res.status(500).send('Internal Server Error');
      }

      if (result) {
        // create token with user info
        const token = (0, _auth.newToken)(user); // current logged-in user

        const loggedInUser = {
          username: user.username,
          nickname: user.nickname
        }; // return the information including token as JSON

        res.status(200).json({
          success: true,
          user: loggedInUser,
          message: 'Login Success',
          token: token
        });
      } else {
        res.status(401).json('Authentication failed. Wrong password.');
      }
    });
  }).catch(error => {
    res.status(500).json('Internal Server Error');
    throw error;
  });
});
router.post('/signup', (req, res) => {
  const {
    username,
    password,
    nickname
  } = req.body; // encrypt password
  // NOTE: 10 is saltround which is a cost factor

  _bcrypt.default.hash(password, 10, (error, hashedPassword) => {
    if (error) {
      return res.status(500).json({
        error
      });
    } else {
      const newUser = new _UserModel.default({
        username,
        password: hashedPassword,
        nickname
      });
      newUser.save((error, saved) => {
        if (error) {
          console.log(error);
        } else {
          console.log(saved);
          res.send(saved);
        }
      });
    }
  });
});
var _default = router;
exports.default = _default;