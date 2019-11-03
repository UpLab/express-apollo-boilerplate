/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import Logger from '../utils/logger';
import Mailer from './mailer';
import config from '../config';
import Emitter from './emitter';
import events from '../subscribers/events';
import UserModel from '../models/users';

const settings = {
  mailer: Mailer,
  logger: Logger,
  emitter: Emitter,
  userModel: UserModel,
};

const constructUserDocument = ({ email, password, salt, profile }) => ({
  services: {
    password: {
      salt,
      hash: password,
    },
  },
  email: { address: email },
  profile,
});

class AuthService {
  constructor({ mailer, logger, emitter, userModel }) {
    this.userModel = userModel;
    this.mailer = mailer;
    this.logger = logger;
    this.emitter = emitter;
  }

  async createAccount(email, password, profile) {
    try {
      const salt = randomBytes(32);
      this.logger.silly('Hashing password');
      const hashedPassword = await argon2.hash(password, { salt });
      this.logger.silly('Creating user db record');
      const userRecord = await this.userModel.create(
        constructUserDocument({
          email,
          password: hashedPassword,
          salt: salt.toString('hex'),
          profile,
        }),
      );
      if (!userRecord) {
        throw new Error('User cannot be created');
      }

      this.emitter.emit(events.user.signUp, { user: userRecord });

      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');

      this.logger.silly('Generating JWT');
      const token = this.generateToken(userRecord);

      return { user, token };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async loginWithPassword(email, password) {
    const userRecord = await this.userModel.findByEmail(email);
    if (!userRecord) {
      throw new Error('The email or password is incorrect.');
    }
    /**
     * We use verify from argon2 to prevent 'timing based' attacks
     */
    this.logger.silly('Checking password');

    const validPassword = await argon2.verify(userRecord.services.password.hash, password);
    if (validPassword) {
      this.logger.silly('Password is valid!');
      this.logger.silly('Generating JWT');
      const token = this.generateToken(userRecord);
      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');

      return { user, token };
    }
    throw new Error('Invalid Password');
  }

  generateToken(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    /**
     * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
     * The cool thing is that you can add custom properties a.k.a metadata
     * Here we are adding the userId, role and name
     * Beware that the metadata is public and can be decoded without _the secret_
     * but the client cannot craft a JWT to fake a userId
     * because it doesn't have _the secret_ to sign it
     * more information here: https://softwareontheroad.com/you-dont-need-passport
     */
    this.logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        _id: user._id,
        role: user.role,
        name: user.name,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret,
    );
  }

  decodeToken(token) {
    const decoded = jwt.verify(token, config.jwtSecret);
    return decoded;
  }

  validateToken(token) {
    let decoded = token;
    if (typeof token === 'string') {
      decoded = this.decodeToken(token);
    }
    const isNotExpired = decoded.exp > new Date().getTime() / 1000;
    if (isNotExpired) return decoded;
    return null;
  }
}

export default new AuthService(settings);
