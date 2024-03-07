// models/user.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    username: { type: String, required: true },
    comment: { type: String, required: false },
    blog: { img: 
        {type: String, 
        required: false},
        title: {type: String, 
            required: true},
        des: {type: String, 
            required: true}, 
        }
});


module.exports = mongoose.model('read', blogSchema);
