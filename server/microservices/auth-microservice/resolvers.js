const User = require('./userModel');
const {setTokenCookie, clearCookie} =  require('./authMethods');


const resolvers = {
    Mutation: {
        signUp: async(_, args, context) => {
            const user = new User(args);
            return await user.save();
        },
        signIn: async(_, {username, password}, context) => {
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
            return true;
        },
        signOut: (_, __, context) => {
            clearCookie(context.res)
            return true;
        }
    }
}

module.exports = resolvers;