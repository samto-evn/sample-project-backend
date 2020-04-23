const { asClass, asValue, asFunction } = require('awilix');
const { RedisPubSub } = require('graphql-redis-subscriptions');
const Redis = require('ioredis');
const winston = require('./winston');
const Bcrypt = require('./bcrypt');
const JWT = require('./jwt');
const mongodb = require('./mongodb');
const minio = require('./minio');
const ServiceProvider = require('../ServiceProvider');

class ThirdPartyServiceProvider extends ServiceProvider {
  register() {
    this.container.register({
      jwt: asClass(JWT).singleton(),
      bcrypt: asClass(Bcrypt).singleton(),
    });
  }

  async boot() {
    const options = {
      host: 'localhost',
      port: '32768',
    };
    const pubsub = new RedisPubSub({
      publisher: new Redis(options),
      subscriber: new Redis(options),
    });
    const db = (await mongodb(this.container.resolve('config'))).db('simple_db');
    this.container.register({
      db: asValue(db),
      pubsub: asValue(pubsub),
      minio: asFunction(minio).singleton(),
      logger: asFunction(winston).singleton(),
    });
  }
}

module.exports = ThirdPartyServiceProvider;