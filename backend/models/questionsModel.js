import mongoose from "mongoose";

const questionsSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options : {
        type: [String],
        required: true
    },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    marks: {
        type: Number,
        required: true
    },
    correctOption: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Question = mongoose.model('Question', questionsSchema);

export default Question;
