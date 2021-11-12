const multer = require('multer');
// const injectDate = require('./index');    // this is multer in which we config the file data like jpeg , webp , png , cnv etc.
// ==-----------------------------------------------disk storage----------------------------------------
// disk storage is used to store the file locally by using => "destination:'uploads/' " as a object inn diskStorage{ }
// var multerconfig = multer({
//   storage: multer.diskStorage({             //  diskStorage store the file locally 
//     destination: 'uploads/',
//     filename: function (req, file, cb) {
//       console.log(req.file)
//       cb(null, injectDate(file.originalname));   // injectDate if a function check in index.js 
//     },
//   }),
//   limits: { fileSize: 1024 * 1024* 2 },                            // limit as file size
//   fileFilter: function (req, file, cb) {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/webp') {  // can use a condition which type of file should be accepted
//       cb(null, true);
//     } else {
//       var newError = new Error('file type is Incorrect');  // error message 
//       newError.name = 'MulterError';   // can rewrite the error name 
//       cb(newError, false);
//     }
//   },
// });
// ---------------------------------------------memory storage---------------------------------------------
// memory storage is used for uploading the file in server as "cloudinery" 
var multerConfig1 = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024*2 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/webp') {  // filtering which type of file should be accepted
      cb(null, true);
    } else {
      var newError = new Error('file type is Incorrect');
      newError.name = 'MulterError';
      cb(newError, false);
    } 
  },
});
var upload = multer(multerConfig1)
module.exports = upload
