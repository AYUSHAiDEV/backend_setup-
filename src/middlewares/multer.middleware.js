 import multer from 'multer'

 // storage initialisation
 const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/temp');  // folder where file save hogi
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // unique naam
  }
});
// filter initialisation
// limits initialisation
const upload = multer({
  storage:storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);   // accept
//     } else {
//       cb(new Error('Only images allowed!'), false);  // reject
//     }
//   },
//   limits: { fileSize: 2 * 1024 * 1024 }  // 2MB max
});

export {upload}
