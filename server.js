//https://www.bezkoder.com/node-js-mongodb-auth-jwt/

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const db = require("./app/models");
const Role = db.role;
const { DB, PORT, HOST } = process.env;

exports.connect = () => {
    mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect = MongoDB.");
        initial();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    })
}

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

//parse requests of content-type - application/json
app.use(express.json());

//parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
});

require('./app/routes/auth.routes') (app);
require('./app/routes/user.routes')(app);

//set port, listen for requests
const PORT1 = PORT || 8080;
app.listen(PORT1, () => {
    console.log(`Server is running on port ${PORT1}`);
});

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if(!err && count ===  0) {
            new Role({
                name: "user"
            }).save(err => {
                if(err) {
                    console.log("error", err);
                }

                console.log("added 'user' to roles collection");
            })

            new Role({
                name: "moderator"
            }).save(err => {
                if(err) {
                    console.log("error", err);
                }

                console.log("added 'moderator' to roles collection");
            });

            new Role({
                name: "admin"
            }).save(err => {
                if(err) {
                    console.log("error", err);
                }

                console.log("added 'admin' to roles collection");
            });
        }
    });
}