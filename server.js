'use strict';

const Hapi = require('hapi');
const mysql = require('mysql');
// Create a server with a host and port
const server = new Hapi.Server();


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hapi'
});




server.connection({
    host: 'localhost',
    port: 8000
});
connection.connect();

// Add the route
server.route({
    method: 'GET',
    path: '/users',
    handler: function (request, reply) {

        connection.query('SELECT * FROM users', function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            reply(results);
        });
        connection.end();
        // return reply('hello world');
    }
});



// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});