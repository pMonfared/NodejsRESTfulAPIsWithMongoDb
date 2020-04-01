
const express = require('express');

const courses = require('../routes/courses');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const returns = require('../routes/returns');
const authentication = require('../routes/authentication');
const home = require('../routes/home');

const error = require('../middleware/error');

module.exports = function (app) { 
    //Express advance config
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'))

    //Routes
    app.use('/api/courses', courses);
    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    app.use('/api/returns', returns);
    app.use('/api/auth', authentication);
    
    app.use('/', home);

    //View config
    app.set('view engine', 'pug');
    app.set('views','./views');

    //Error middlewares
    app.use(error);
}