var localStrategy = require("passport-local").Strategy;
var configDb = require("../config/database");
var bcrypt = require("bcryptjs");

/**
 * Export the passport:
 *  LocalStrategy
 *  serializeUser
 *  deserializeUser
 */
