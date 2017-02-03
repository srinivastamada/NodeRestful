'use strict';

const Hapi = require('hapi');
const mysql = require('mysql');
const Joi = require('joi');
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

        connection.query('SELECT uid, username FROM users', function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            reply(results);
        });


        // return reply('hello world');
    }
});

server.route({
    method: 'GET',
    path: '/user/{uid}',
    handler: function (request, reply) {
        const uid = request.params.uid;

        connection.query('SELECT uid, username FROM users WHERE uid = "' + uid + '"', function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            reply(results);
        });

    },
    config: {
        validate: {
            params: {
                uid: Joi.number().integer()
            }
        }
    }
});



server.route({
    method: 'POST',
    path: '/messages',
    config: {
        handler: function (request, reply) {

            const uid = request.payload.uid;
            console.log(uid);

            connection.query('SELECT * FROM messages WHERE uid_fk = "' + uid + '"', function (error, results, fields) {
                if (error) throw error;
                console.log(results);
                reply(results);
            });

        },

        validate: {
            payload: {
                uid: Joi.number().integer()
            }
        }

    }

});

server.route({
    method: 'DELETE',
    path: '/user/{id}',
    handler: function (request, reply) {
        // if (quotes.length <= request.params.id) {
        //   return reply('No quote found.').code(404);
        // }
        // quotes.splice(req.params.id, 1);
        // reply(true);
    }
});



//connection.end();

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});