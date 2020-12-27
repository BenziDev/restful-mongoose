import { Router } from 'express';
import Joi from '@hapi/joi';
import User from '../models/user';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export default (config) => {

  let api = Router();

  // signup endpoint
  api.post("/signup", async (req, res) => {

    // validate json body
    const { error } = signupSchema.validate(req.body);
    if (error) return res.status(400).json({"statusCode": 400, "error": error.details[0].message});

    try {

      const user = await User.findOne({email: req.body.email});

      if (user) return res.status(400).json({"statusCode": 400, "error": "Email already used"});

      const hash = await argon2.hash(req.body.password, {type: argon2.argon2id});

      const newUser = new User({
        email: req.body.email,
        hash
      });

      const savedUser = await newUser.save();

      const token = jwt.sign({
        uid: savedUser._id
      }, config.get("secret"), {
        expiresIn: 60*60*24*1
      });

      res.status(200).json({"statusCode": 200, "access_token": token});

    } catch (err) {

      res.status(500).json({"statusCode": 500, "error": "Internal server error"});

    }

  });

  // login  endpoint
  api.post("/login", async (req, res) => {

    // validate json data
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({"statusCode": 400, "error": error.details[0].message});

    try {

      const user = await User.findOne({email: req.body.email});

      if (!user) return res.status(400).json({"statusCode": 400, "error": "Invalid email or password"});

      const matches = await argon2.verify(user.hash, req.body.password, {type: argon2.argon2id});

      if (matches) {

        const token = jwt.sign({
          uid: user._id
        }, config.get("secret"), {
          expiresIn: 60*60*24*1
        });
  
        res.status(200).json({"statusCode": 200, "access_token": token});

      } else {
        res.status(400).json({"statusCode": 400, "error": "Invalid email or password"});
      }

    } catch (err) {

      res.status(500).json({"statusCode": 500, "error": "Internal server error"});

    }
    
  });

  return api;

}

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(30)
});

const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6).max(30)
});