var Genre = require('../models/genre');
const validator = require('express-validator');
var Book = require('../models/book');
// Display list of all Genre.
exports.genre_list = async function(req, res) {
    var result  = await Genre.find({});
  
    return result;
};

// Display detail page for a specific Genre.
exports.genre_detail = async function(id) {
    try{
    var res = await Genre.findById(id);
    }
    catch(err)
    {
        console.log(err);
    }
    return res;
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res) {
    res.status(200).render("genre_form",{
        title: 'Create Genre',
        layout: 'main.hbs'
    })
};

// Handle Genre create on POST.
exports.genre_create_post = [
   
    // Validate that the name field is not empty.
    validator.body('name', 'Genre name required').trim().isLength({ min: 1 }),
    
    // Sanitize (escape) the name field.
    validator.sanitizeBody('name').escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validator.validationResult(req);
  
      // Create a genre object with escaped and trimmed data.
      var genre = new Genre(
        { name: req.body.name }
      );
  
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('genre_form', {
             title: 'Create Genre',
              genre: genre, 
              errors: errors.array()
            });
        return;
      }
      else {
        // Data from form is valid.
        // Check if Genre with same name already exists.
        Genre.findOne({ 'name': req.body.name })
          .exec( function(err, found_genre) {
             if (err) { return next(err); }
  
             if (found_genre) {
               // Genre exists, redirect to its detail page.
               res.redirect(found_genre.url);
             }
             else {
  
               genre.save(function (err) {
                 if (err) { return next(err); }
                 // Genre saved. Redirect to genre detail page.
                 res.redirect(genre.url);
               });
  
             }
  
           });
      }
    }
  ];

// Display Genre delete form on GET.
exports.genre_delete_get = async function(req, res) {
      var books = await Book.find({genre:req.params.id})
      var books1 = await JSON.parse(JSON.stringify(books));
      var genre = await Genre.findById(req.params.id);
      var genre1 = await JSON.parse(JSON.stringify(genre));
     
      res.status(200).render('genre_delete',{
        title:"genre delete",
        books: books1,
        genre: genre1
     })  
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
  Genre.findByIdAndRemove(req.body.genreid, function deleteGenre(err) {
    if (err) { return next(err); }
    // Success - go to author list
    res.redirect('/catalog/genres')
})
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};