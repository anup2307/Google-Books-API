const { User, bookschema } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    user: async (parent, { username }) => {
      console.log(username);
      return await User.findOne({ username });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      console.log("resolvers", username, email, password);
      const user = await User.create({ username, email, password });
      console.log(user);
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      console.log("in resolver");
      const user = User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }
      console.log(user);
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw AuthenticationError;
      }
      const token = signToken(user);

      return { token, user };
    },

    addBook: async (
      parent,
      { description, bookId, image, link, title },
      context
    ) => {
      if (context.user) {
        const book = await Book.create({
          thoughtText,
          thoughtAuthor: context.user.username,
        });
      }
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        return User.deleteOne(
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
      }
      throw AuthenticationError;
    },
  },
};

module.exports = resolvers;
