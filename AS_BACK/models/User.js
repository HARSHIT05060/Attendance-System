// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        employeeCode: {
            type: String,
            ref: 'Employee',
            required: true,
            unique: true,
        },
        // 🔹 Phone number for login
        number: {
            type: String,
            trim: true,
            unique: true,
            sparse: true, // allow old docs without number
        },
        // (Optional) Keep username for legacy/admin logins
        username: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
        },
        password: { type: String, required: true }, // hashed
        role: {
            type: String,
            enum: ['Admin', 'HR', 'Manager', 'Employee'],
            default: 'Employee',
        },
        permissions: {
            canApproveLeave: { type: Boolean, default: false },
            canEditSalary: { type: Boolean, default: false },
            canAccessPayroll: { type: Boolean, default: false },
            canManageUsers: { type: Boolean, default: false },
        },
        status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
        lastLogin: { type: Date },
        twoFactorEnabled: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// 🔒 Hash password on create/update
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (err) {
        next(err);
    }
});

// ✅ Compare plain vs hashed
userSchema.methods.comparePassword = function (plain) {
    return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
