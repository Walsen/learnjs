/**
 * Created by sergio.rodriguez on 9/30/14.
 */
var mongoose = require('mongoose');

/*****************************
 * USER SCHEMA
 * ***************************/
var Schema = mongoose.Schema;

var isNotTooShort = function (string) {
    return string && string.length >= 5;
};
// The following two lines will do the same thing
// var validateLength = [isNotTooShort, 'Too short'];
var validateLength = [{validator: isNotTooShort, msg: "Too short"}];

var validateEmail = [/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Invalid email address"];

var userSchema = new Schema ({
    /* Validatethe name referencing a validor object */
    name: { type: String, required: true, validate: validateLength },
    /* Validatethe name inline, calling the function directly */
    // name: { type: String, required: true, validate: { validator: isNotTooShort, msg: 'Much too short'} },

    /* Validate the email address referencing a validor object */
    email: { type: String, unique: true, required: true, validate: validateEmail },
    /* Validate email with a RegEx validator and custom error message */
    // email: {type: String, unique:true, required : true, validate: { validator: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, msg: 'Invalid email address'} },
    /* Validate email using built-in String match validator (no custom message) */
    // email: {type: String, unique:true, required : true, match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i },

    createdOn: { type: Date, default: Date.now },
    modifiedOn: Date,
    lastLogin: Date
});

// Build the User model
module.exports = mongoose.model( 'User', userSchema );
