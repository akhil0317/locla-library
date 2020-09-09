var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');
var mongoose = require("mongoose");
var config = require("../dbConfig/config.js");
mongoose.set('toJSON', { virtuals: true });
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
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
    try{
   var res = await   Book.find({ 'genre': id })
    }
    catch(err)
    {
        console.log(err);
    }
   return res;
};

exports.book_detailsByBookID = async function(id){
    try{
    var res = await Book.findById(id)
      .populate('author')
      .populate('genre')
      return res;
    }
    catch(err)
    {
    console.log(err);
    }
}
exports.book_detailsByAuthorId = async function(id){
    try{
        var res  = await Book.find({ 'author': id },'title summary')

    }
    catch(err)
    {
        console.log(err);
    }
    return res;
}

// Display book create form on GET.
exports.book_create_get = async function(req, res) {
    try{
    var result = await Author.find({})
    }
    catch(err)
    {
        return next(err);
    }
    try{
    var authors = await JSON.parse(JSON.stringify(result));
    }
    catch(err)
    {
        return next(err);
    }
        try{
    var result1 = await Genre.find({});
        }
        catch(err)
    {
        return next(err);
    }
    try{
    var genres = await JSON.parse(JSON.stringify(result1));
    }
    catch(err)
    {
        return next(err);
    }
    res.status(200).render('book_form', { title: 'Create Book', authors: authors, genres: genres })

};

// Handle book create on POST.
exports.book_create_post = [
   
    // Validate fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),
    body('author', 'Author must not be empty.').trim().isLength({ min: 1 }),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }),
    body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }),
  
    // Sanitize fields (using wildcard).
    sanitizeBody('*').escape(),

    // Process request after validation and sanitization.
    async (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var book = new Book(
          { title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre
           });

        if (!errors.isEmpty()) {
            try{
                var result = await Author.find({})
                }
                catch(err)
                {
                    return next(err);
                }
                try{
                var authors = await JSON.parse(JSON.stringify(result));
                }
                catch(err)
                {
                    return next(err);
                }
                    try{
                var result1 = await Genre.find({});
                    }
                    catch(err)
                {
                    return next(err);
                }
                try{
                var genres = await JSON.parse(JSON.stringify(result1));
                }
                catch(err)
                {
                    return next(err);
                }
                res.status(200).render('book_form', { title: 'Create Book', authors: authors, genres: genres })
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
             
                res.render('book_form', { title: 'Create Book',authors:authors, genres:genres, book: book, errors: errors.array() });
           
        }
        else {
            // Data from form is valid. Save book.
            book.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new book record.
                   res.redirect(book.url);
                });
        }
    }
];

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