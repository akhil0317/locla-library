var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
// Display list of all BookInstances.
exports.bookinstance_list = async function(req, res) {
    const bookInstances = await  BookInstance.find()
    .populate('book')
    return bookInstances;

};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = async function(id) {
   var res =  await BookInstance.find({ 'book': id})
   return res;
};

exports.bookinstance_details_byInstanceId = async function(id){
    try{
        var res = await BookInstance.findById(id)
        .populate('book')
    }
    catch(err)
    {
        console.log(err);
    }
    return res;

}

// Display BookInstance create form on GET.
exports.bookinstance_create_get =  function(req, res) {
    Book.find({},'title')
    .exec(async function (err, books) {
      if (err) { return next(err); }
      // Successful, so render.
        
  var   bookList = await JSON.parse(JSON.stringify(books))
      res.render('bookinstance_form', {title: 'Create BookInstance', book_list: bookList});
    });
    
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [

    // Validate fields.
    body('book', 'Book must be specified').trim().isLength({ min: 1 }),
    body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),
    
    // Sanitize fields.
    sanitizeBody('book').escape(),
    sanitizeBody('imprint').escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),
    
    // Process request after validation and sanitization.
    async (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
       var bookId = await Book.findOne({ title:req.body.book}).select('_id');
        var bookinstance = new BookInstance(
          { book: bookId,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Book.find({},'title')
                .exec(async function (err, books) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    var   bookList = await JSON.parse(JSON.stringify(books))
                    res.render('bookinstance_form', { title: 'Create BookInstance', book_list: bookList, selected_book: bookinstance.book._id , errors: errors.array(), bookinstance: bookinstance });
            });
            return;
        }
        else {
            // Data from form is valid.
            bookinstance.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new record.
                   res.redirect(bookinstance.url);
                });
        }
    }
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
};