import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isDeleated: {
        type: Boolean,
        default: false
    }
}, { timestamps : true });

const User = mongoose.model('User', userSchema);

export default User;
