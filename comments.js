// Description: REST API for comments
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;

// Create in-memory data store
var comments = [
    {id: 1, author: 'Pete Hunt', text: 'This is one comment'},
    {id: 2, author: 'Jordan Walke', text: 'This is *another* comment'},
    {id: 3, author: 'John Smith', text: 'This is *yet another* comment'}
];

// Configure app to use bodyParser()
// This will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Set up routing
var router = express.Router();

// Middleware to use for all requests
router.use(function (req, res, next) {
    console.log('Request received');
    next();
});

// GET /comments
router.get('/', function (req, res) {
    res.json(comments);
});

// GET /comments/:id
router.get('/:id', function (req, res) {
    var comment = comments.find(function (comment) {
        return comment.id == req.params.id;
    });
    if (comment) {
        res.json(comment);
    } else {
        res.status(404).json({message: 'Comment not found'});
    }
});

// POST /comments
router.post('/', function (req, res) {
    var comment = req.body;
    if (!comment.id) {
        res.status(400).json({message: 'Bad request'});
    } else {
        comments.push(comment);
        res.status(201).json({message: 'Comment created'});
    }
});
