/**
 * Created by sergio.rodriguez on 9/30/14.
 */
var mongoose = require('mongoose');

/*****************************
 * USER SCHEMA
 * ***************************/
var Schema = mongoose.Schema;

var userSchema = new Schema ({
    name: String,
    email: {type: String, unique: true },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: Date,
    lastLogin: Date
});

// Build the User model
module.exports = mongoose.model( 'User', userSchema );
