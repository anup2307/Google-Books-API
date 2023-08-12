const {User} = require('../models')
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query:{

        user: async (parent, {username}) => {
            return User.findOne({username})
        },
        me: async (parent, args, context) => {
            if (context.user) {
              return User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('You need to be logged in!');
          },
    },

    Mutation:{

        addUser: async (parent, {username, email,password}) => {
            const user = User.create({username, email,password})
            const token= signToken(user);
            return {token,user};
        },

        login: async (parent, {email, password}) => {
            const user = User.findOne({email});
            if (!user) {
                throw AuthenticationError;
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw AuthenticationError;
            }
            const token = signToken(user);

            return { token, user }
        }
    }
}
