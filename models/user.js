var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var schema = new mongoose.Schema({
    local: {
        email: String,
        password: String
    },
    admin: {
        type: Boolean,
        default:false
    }
});

schema.statics.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
};

schema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
};

schema.statics.getUser = function(id){
    //todo check dis
    console.log('id',id);
    return this.findById(id).exec(function (err, user) {
        if (err) {
            return console.error(err);
        }
        return user;
    });
};

var user = module.exports = mongoose.model('user', schema);