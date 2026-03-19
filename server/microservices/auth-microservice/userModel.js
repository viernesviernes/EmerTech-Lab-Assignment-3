const mongoose = require('mongoose');
const bycrypt = require('bcrypt');

const saltRounds = 10;


const UserSchema = new mongoose.Schema({
    username: {type: String, require: true, unique: true},
    email: {
        type: String,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: true,
        unique: true,
    },
    password: {
        type: String,
        validate: [
            (password) => password && password.length > 7,
            'Password should be 8 characters or more!'
        ],
        require: true,
    },
    role: {
        type: String,
        enum: ['resident', 'business_owner', 'community_organizer'],
        require: true,
    },
    createdAt: {type: Date, default: Date.now}
});

UserSchema.pre('save', function (next){
    this.password = bycrypt.hashSync(this.password, saltRounds);
});

UserSchema.methods.authenticate = function (password){
    return bycrypt.compareSync(password, this.password);
};


const User = mongoose.model('User', UserSchema);
module.exports = User;

