const User = require('../model/userModel');
const {setTokenCookie, clearCookie, getUserIdFromToken} =  require('../authMethods');


const resolvers = {
    Query: {
        currentUser: async(_, __, context) => {
            //create logic, to search user, based on off cookie token user id
            const userId = getUserIdFromToken(context);
            if (!userId) return null;
            return await User.findById(userId);
        },
    },
    Mutation: {
        register: async(_, args, context) => {
            const user = new User(args);
            return await user.save();
        },
        loginByUsername: async(_, {username, password}, context) => {
            console.log(`Username: ${username}, password: ${password}`);
            const user = await User.findOne({username});
            if (user == null){
                console.log("User not found");
                return false;
            }
            
            if (!user.authenticate(password)){
                console.log("password is wrong");
                return false;
            };
            setTokenCookie(context.res, {id: user._id.toString(), role: 'user'});
            return user;
        },
        loginByEmail: async(_, {email, password}, context) => {
            const user = await User.findOne({email});
            if (user == null){
                console.log("User not found");
                throw new Error("User not found");
            }
            
            if (!user.authenticate(password)){
                console.log("password is wrong");
                throw new Error("Password is incorrect");
            };
            setTokenCookie(context.res, {id: user._id.toString(), role: 'user'});
            return user;
        },
        signOut: (_, __, context) => {
            clearCookie(context.res)
            return true;
        }
    }
}

module.exports = resolvers;