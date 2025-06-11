const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    schedule: {
        Monday: {
            isActive: { type: Boolean, default: false },
            isWeekOff: { type: Boolean, default: false },
            fromHour: { type: Number, min: 1, max: 12 },
            fromMinute: { type: String, enum: ['00', '15', '30', '45'] },
            fromPeriod: { type: String, enum: ['AM', 'PM'] },
            toHour: { type: Number, min: 1, max: 12 },
            toMinute: { type: String, enum: ['00', '15', '30', '45'] },
            toPeriod: { type: String, enum: ['AM', 'PM'] },
            occasionalWorkingEnabled: { type: Boolean, default: false },
            occasionalWorkingWeeks: [{ type: Number, min: 1, max: 5 }],
            occasionalFromHour: { type: Number, min: 1, max: 12 },
            occasionalFromMinute: { type: String, enum: ['00', '15', '30', '45'] },
            occasionalFromPeriod: { type: String, enum: ['AM', 'PM'] },
            occasionalToHour: { type: Number, min: 1, max: 12 },
            occasionalToMinute: { type: String, enum: ['00', '15', '30', '45'] },
            occasionalToPeriod: { type: String, enum: ['AM', 'PM'] }
        },
        Tuesday: {
            isActive: { type: Boolean, default: false },
            isWeekOff: { type: Boolean, default: false },
            fromHour: { type: Number, min: 1, max: 12 },
            fromMinute: { type: String, enum: ['00', '15', '30', '45'] },
            fromPeriod: { type: String, enum: ['AM', 'PM'] },
            toHour: { type: Number, min: 1, max: 12 },
            toMinute: { type: String, enum: ['00', '15', '30', '45'] },
            toPeriod: { type: String, enum: ['AM', 'PM'] },
            occasionalWorkingEnabled: { type: Boolean, default: false },
            occasionalWorkingWeeks: [{ type: Number, min: 1, max: 5 }],
            occasionalFromHour: { type: Number, min: 1, max: 12 },
            occasionalFromMinute: { type: String, enum: ['00', '15', '30', '45'] },
            occasionalFromPeriod: { type: String, enum: ['AM', 'PM'] },
            occasionalToHour: { type: Number, min: 1, max: 12 },
            occasionalToMinute: { type: String, enum: ['00', '15', '30', '45'] },
            occasionalToPeriod: { type: String, enum: ['AM', 'PM'] }
        },
        Wednesday: {
            isActive: { type: Boolean, default: false },
            isWeekOff: { type: Boolean, default: false },
            fromHour: { type: Number, min: 1, max: 12 },
            fromMinute: { type: String, enum: ['00', '15', '30', '45'] },
            fromPeriod: { type: String, enum: ['AM', 'PM'] },
            toHour: { type: Number, min: 1, max: 12 },
            toMinute: { type: String, enum: ['00', '15', '30', '45'] },
            toPeriod: { type: String, enum: ['AM', 'PM'] },
            occasionalWorkingEnabled: { type: Boolean, default: false },
            occasionalWorkingWeeks: [{ type: Number, min: 1, max: 5 }],
            occasionalFromHour: { type: Number, min: 1, max: 12 },
            occasionalFromMinute: { type: String, enum: ['00', '15', '30', '45'] },
            occasionalFromPeriod: { type: String, enum: ['AM', 'PM'] },
            occasionalToHour: { type: Number, min: 1, max: 12 },
            occasionalToMinute: { type: String, enum: ['00', '15', '30', '45'] },
            occasionalToPeriod: { type: String, enum: ['AM', 'PM'] }
        },
        Thursday: {
            isActive: { type: Boolean, default: false },
            isWeekOff: { type: Boolean, default: false },
            fromHour: { type: Number, min: 1, max: 12 },
            fromMinute: { type: String, enum: ['00', '15', '30', '45'] },
            fromPeriod: { type: String, enum: ['AM', 'PM'] },
            toHour: { type: Number, min: 1, max: 12 },
            toMinute: { type: String, enum: ['00', '15', '30', '45'] },
            toPeriod: { type: String, enum: ['AM', 'PM'] },
            occasionalWorkingEnabled: { type: Boolean, default: false },
            occasionalWorkingWeeks: [{ type: Number, min: 1, max: 5 }],
            occasionalFromHour: { type: Number, min: 1, max: 12 },
            occasionalFromMinute: { type: String, enum: ['00', '15', '30', '45'] },
            occasionalFromPeriod: { type: String, enum: ['AM', 'PM'] },
            occasionalToHour: { type: Number, min: 1, max: 12 },
            occasionalToMinute: { type: String, enum: ['00', '15', '30', '45'] },
            occasionalToPeriod: { type: String, enum: ['AM', 'PM'] }
        },
        Friday: {
            isActive: { type: Boolean, default: false },
            isWeekOff: { type: Boolean, default: false },
            fromHour: { type: Number, min: 1, max: 12 },
            fromMinute: { type: String, enum: ['00', '15', '30', '45'] },
            fromPeriod: { type: String, enum: ['AM', 'PM'] },
            toHour: { type: Number, min: 1, max: 12 },
            toMinute: { type: String, enum: ['00', '15', '30', '45'] },
            toPeriod: { type: String, enum: ['AM', 'PM'] },
            occasionalWorkingEnabled: { type: Boolean, default: false },
            occasionalWorkingWeeks: [{ type: Number, min: 1, max: 5 }],
            occasionalFromHour: { type: Number, min: 1, max: 12 },
            occasionalFromMinute: { type: String, enum: ['00', '15', '30', '45'] },
            occasionalFromPeriod: { type: String, enum: ['AM', 'PM'] },
            occasionalToHour: { type: Number, min: 1, max: 12 },
            occasionalToMinute: { type: String, enum: ['00', '15', '30', '45'] },
            occasionalToPeriod: { type: String, enum: ['AM', 'PM'] }
        },
        Saturday: {
            isActive: { type: Boolean, default: false },
            isWeekOff: { type: Boolean, default: false },
            fromHour: { type: Number, min: 1, max: 12 },
            fromMinute: { type: String, enum: ['00', '15', '30', '45'] },
            fromPeriod: { type: String, enum: ['AM', 'PM'] },
            toHour: { type: Number, min: 1, max: 12 },
            toMinute: { type: String, enum: ['00', '15', '30', '45'] },
            toPeriod: { type: String, enum: ['AM', 'PM'] },
            occasionalWorkingEnabled: { type: Boolean, default: false },
            occasionalWorkingWeeks: [{ type: Number, min: 1, max: 5 }],
            occasionalFromHour: { type: Number, min: 1, max: 12 },
            occasionalFromMinute: { type: String, enum: ['00', '15', '30', '45'] },
            occasionalFromPeriod: { type: String, enum: ['AM', 'PM'] },
            occasionalToHour: { type: Number, min: 1, max: 12 },
            occasionalToMinute: { type: String, enum: ['00', '15', '30', '45'] },
            occasionalToPeriod: { type: String, enum: ['AM', 'PM'] }
        },
        Sunday: {
            isActive: { type: Boolean, default: false },
            isWeekOff: { type: Boolean, default: false },
            fromHour: { type: Number, min: 1, max: 12 },
            fromMinute: { type: String, enum: ['00', '15', '30', '45'] },
            fromPeriod: { type: String, enum: ['AM', 'PM'] },
            toHour: { type: Number, min: 1, max: 12 },
            toMinute: { type: String, enum: ['00', '15', '30', '45'] },
            toPeriod: { type: String, enum: ['AM', 'PM'] },
            occasionalWorkingEnabled: { type: Boolean, default: false },
            occasionalWorkingWeeks: [{ type: Number, min: 1, max: 5 }],
            occasionalFromHour: { type: Number, min: 1, max: 12 },
            occasionalFromMinute: { type: String, enum: ['00', '15', '30', '45'] },
            occasionalFromPeriod: { type: String, enum: ['AM', 'PM'] },
            occasionalToHour: { type: Number, min: 1, max: 12 },
            occasionalToMinute: { type: String, enum: ['00', '15', '30', '45'] },
            occasionalToPeriod: { type: String, enum: ['AM', 'PM'] }
        },
        // ... repeat for other days (Wednesday, , , , )
    },
    totalWeeklyHours: {
        type: Number,
        min: 0,
        max: 168 // 24 hours * 7 days
    },
    activeWorkingDays: {
        type: Number,
        min: 1,
        max: 7,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Shift', shiftSchema);
