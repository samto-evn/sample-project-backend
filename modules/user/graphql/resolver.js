const { isEmpty, pickBy, identity } = require('lodash');

module.exports = {
  Query: {
    user: (_, { id }, { userProvider }) => userProvider.findById(id),
    userList: async (_, args, { userProvider }) => {
      if (isEmpty(args)) {
        return userProvider
          .find({ query: { }, page: { limit: 10, skip: 0 } });
      }
      const { query: { searchText, limit, skip } } = args;
      const pattern = !isEmpty(searchText) ? new RegExp(`${searchText}`) : null;
      return userProvider
        .find({ query: pattern ? { $or: [{ name: pattern }, { email: pattern }] } : {}, page: { limit, skip } });
    },
  },
  Mutation: {
    createUser: (_, { user }, { authService }) => authService.register(user),
    login: (_, { user }, { authService }) => authService.login(user.email, user.password),
    updateUser: async (_, { user }, { userProvider }) => userProvider.update(user.id, user),
    deleteUser: (_, { id }, { userProvider }) => userProvider.delete(id),
  },
  User: {
    messages: (user, args, { messageProvider }) => {
      if (isEmpty(args)) {
        return messageProvider
          .find({ query: { userId: user.id }, page: { limit: 10, skip: 0 } });
      }
      const { query: { searchText, limit, skip } } = args;
      const content = !isEmpty(searchText) ? new RegExp(`${searchText}`) : null;
      return messageProvider
        .find({ query: pickBy({ userId: user.id, content }, identity), page: { limit, skip } });
    },
  },
};
