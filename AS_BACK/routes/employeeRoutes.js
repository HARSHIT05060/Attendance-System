const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    createEmployee
} = require('../controllers/employeeController');

// ================= MULTER SETUP =================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure 'uploads' folder exists
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        console.error(`Rejected file type: ${file.originalname} (${file.mimetype})`);
        cb(new Error('Invalid file type. Only JPG, PNG, PDF allowed.'), false);
    }
};

const upload = multer({ storage, fileFilter });
// ==================================================

// CRUD Routes
router.get('/employees', getAllEmployees);
router.get('/employees/:id', getEmployeeById);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);

router.post(
    '/employees',
    upload.fields([
        { name: 'photo', maxCount: 1 },
        { name: 'aadharCard', maxCount: 1 },
        { name: 'panCard', maxCount: 1 },
        { name: 'drivingLicence', maxCount: 1 },
        { name: 'references' }
    ]),
    createEmployee
);

module.exports = router;
