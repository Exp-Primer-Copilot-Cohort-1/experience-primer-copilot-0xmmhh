//Create web server
var express = require("express");
var app = express();

//Create server
var server = require("http").createServer(app);

//Create socket io server
var io = require("socket.io")(server);

//Create mysql connection
var mysql = require("mysql");

//Create connection to database
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "comments"
});

//Connect to database
connection.connect();

//Create server
server.listen(3000);

//Create route for comments
app.get("/comments", function(req, res){
    //Query database
    connection.query("SELECT * FROM comments", function(err, data){
        if(err){
            console.log(err);
        } else {
            res.send(data);
        }
    });
});

//Create socket io connection
io.on("connection", function(socket){
    //On connection, log to console
    console.log("A user connected");

    //On disconnect, log to console
    socket.on("disconnect", function(){
        console.log("A user disconnected");
    });

    //On comment, log to console
    socket.on("comment", function(data){
        console.log(data);
        //Insert into database
        connection.query("INSERT INTO comments SET ?", data, function(err, result){
            if(err){
                console.log(err);
            } else {
                console.log(result);
                //Emit comment to all clients
                io.emit("comment", data);
            }
        });
    });
});