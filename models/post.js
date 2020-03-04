var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    pinned: {
        type: Boolean,
        required: true
    },
    content: {
        type: String,
        default: function () {
            return "";
        }
    },
    visible: {
        type: Boolean,
        default: false,
    },
    deleted: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    tags: [String],
    created_at: {
        type: Date,
        required: true,
        default: function () {
            return Date.now();
        }
    },
    updated_at: {
        type: Date,
        required: true,
        default: function () {
            return Date.now();
        }
    }
});

schema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

schema.statics.getPost = function (id) {
    //todo check dis
    return this.findById(id);
};

schema.statics.getAllPosts = function () {
    return this.find().where('deleted', false).sort({'created_at':-1});
};

schema.statics.getNotPinnedPosts = function () {
    return this.find()
        .where('pinned', false)
        .where('deleted', false)
        .where('visible', true)
        .sort({'created_at':-1});
};

schema.statics.getPinnedPosts = function () {
    return this.find()
        .where('pinned', true)
        .where('deleted', false)
        .where('visible', true)
        .sort({'created_at':-1});
};

var post = module.exports = mongoose.model('post', schema);