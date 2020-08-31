var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');
var mongoose = require("mongoose");
var config = require("../dbConfig/config.js");
mongoose.set('toJSON', { virtuals: true });

var async = require('async');

exports.index =  async function() {   
 var details ={};
var  count  = await Book.countDocuments({})
details.book_count=count;

count  = await  BookInstance.countDocuments({})
details.book_instance_count=count;

count  = await  BookInstance.countDocuments({status:'Available'})
details.book_instance_available_count=count;

count  = await  Author.countDocuments({})
details.author_count=count;

count  = await  Genre.countDocuments({})
details.genre_count=count;

console.log(details);
    return details;
};

// Display list of all books.
exports.book_list =async function(req, res) {
    var bookList = {};
    var result  = await Book.find({},'title author').populate('author');
    console.log(result);
    return result;
};

// Display detail page for a specific book.
exports.book_detail = async  function(id) {
   var res = await   Book.find({ 'genre': id })
   return res;
};

// Display book create form on GET.
exports.book_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle book create on POST.
exports.book_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create POST');
};

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};