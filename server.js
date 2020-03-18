'use strict';

const Hapi = require('@hapi/hapi');
const MySQL = require('mysql');
const Joi = require('@hapi/joi');
const Bcrypt = require('bcrypt');
// Create a server with a host and port
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});


const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node'
});



const init = async () => {
    server.route({
        method: 'GET',
        path: '/helloworld',
        handler: function (request, reply) {
            return reply.response('hello world');
        }
    });
    
    // Add the route
    server.route({
        method: 'GET',
        path: '/users',
        handler: function (request, reply) {
           var result;
          connection.query('SELECT uid, username FROM users', function (error, data, fields) {
                if (error) throw error;
                console.log(data);
               result = data;
            });
           
            return result;
            
        }
    });
    
    server.route({
        method: 'GET',
        path: '/user/{uid}',
        handler: function (request, reply) {
            const uid = request.params.uid;
    
            connection.query('SELECT uid, username, email FROM users WHERE uid = "' + uid + '"', function (error, results, fields) {
                if (error) throw error;
                console.log(results);
                reply(results);
            });
    
        },
        config: {
            validate: {
                params: Joi.object({
                    uid: Joi.number().integer()
                })
            }
        }
    });
    
    server.route({
        method: 'POST',
        path: '/signup',
    
        handler: function (request, reply) {
    
            const username = request.payload.username;
            const email = request.payload.email;
            const password = request.payload.password;
    
            var salt = Bcrypt.genSaltSync();
            var encryptedPassword = Bcrypt.hashSync(password, salt);
         
            var orgPassword = Bcrypt.compareSync(password, encryptedPassword);
    
            connection.query('INSERT INTO users (username,email,password) VALUES ("' + username + '","' + email + '","' + encryptedPassword + '")', function (error, results, fields) {
                if (error) throw error;
                console.log(results);
                reply(results);
            });
    
        },
        config: {
            validate: {
                payload: Joi.object({
                    username: Joi.string().alphanum().min(3).max(30).required(),
                    email: Joi.string().email(),
                    password: Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/)
                })
            }
    
        }
    });
    
    
    server.route({
        method: 'POST',
        path: '/sendMessage',
        handler: function (request, reply) {
    
            const uid = request.payload.uid;
            const message = request.payload.message;
           
            connection.query('INSERT INTO messages (message,uid_fk) VALUES ("' + message + '","' + uid + '")', function (error, results, fields) {
                if (error) throw error;
                console.log(results);
                reply(results);
            });
    
        },
        config: {
            validate: {
                payload: Joi.object({
                    uid: Joi.number().integer(),
                    message: [Joi.string(), Joi.number()]
                })
            }
    
        }
    });
    
    server.route({
        method: 'POST',
        path: '/messages',
    
        handler: function (request, reply) {
    
            const uid = request.payload.uid;
            console.log(uid);
    
            connection.query('SELECT * FROM messages WHERE uid_fk = "' + uid + '"', function (error, results, fields) {
                if (error) throw error;
                console.log(results);
                reply(results);
            });
    
        },
        config: {
            validate: {
                payload: Joi.object({
                    uid: Joi.number().integer()
                })
            }
    
        }
    });
    
    server.route({
        method: 'DELETE',
        path: '/message/{uid}/{mid}',
        handler: function (request, reply) {
            const uid = request.params.uid;
            const mid = request.params.mid;
    
            console.log(uid + "---" + mid);
    
            connection.query('DELETE FROM messages WHERE uid_fk = "' + uid + '"AND mid = "' + mid + '"', function (error, result, fields) {
                if (error) throw error;
    
                if (result.affectedRows) {
                    reply(true);
                } else {
                    reply(false);
                }
    
            });
        },
        config: {
            validate: {
                params:  Joi.object({
                    uid: Joi.number().integer(),
                    mid: Joi.number().integer()
                })
            }
    
        }
    });
    
    await server.start((err) => {

        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
};

init();

// Start the server
// server.start((err) => {

//     if (err) {
//         throw err;
//     }
//     console.log('Server running at:', server.info.uri);
// });

