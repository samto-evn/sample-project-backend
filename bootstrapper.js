const { asClass, asValue, asFunction } = require('awilix');
const container = require('./container');
const mongodb = require('./services/mongodb');
const minio = require('./services/minio');
const UserProvider = require('./modules/user/UserProvider');
const MessageProvider = require('./modules/message/MessageProvider');
const Bcrypt = require('./services/bcrypt');
const JWT = require('./services/jwt');
const config = require('./config');
const Authenticator = require('./modules/user/Authenticator');
const winston = require('./services/winston');
const mutationRecorder = require('./services/mutationRecorder');

/**
 * ensures all essential modules are already available before lunching app.
 * @returns {Promise<container>}
 */
module.exports = async () => {
  const db = (await mongodb(config)).db('simple_db');
  container.register({
    db: asValue(db),
    userProvider: asClass(UserProvider).inject((injectedContainer) => ({ users: injectedContainer.resolve('db').collection('users') })).singleton(),
    messageProvider: asClass(MessageProvider)
      .inject((injectedContainer) => ({ messages: injectedContainer.resolve('db').collection('messages') })).singleton(),
    config: asValue(config),
    minio: asFunction(minio).singleton(),
    jwt: asClass(JWT).singleton(),
    bcrypt: asClass(Bcrypt).singleton(),
    authService: asClass(Authenticator).singleton(),
    logger: asValue(winston),
    mutationRecorder: asValue(mutationRecorder),
  });
  return container;
};
