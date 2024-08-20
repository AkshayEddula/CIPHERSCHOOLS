import User from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const signUp = async (req,res) => {
    try {
        const { name, email, password} = req.body;

        // checking if All fields exist or not
        if(!name || !email || !password){
            return res.status(400).json({message: 'All fields are required'});
        }

        // validating email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // checking if the email and name already exist in the database
        const existingEmail = await User.findOne({ email });
        if(existingEmail){
            return res.status(400).json({ error: "Email already exists try different one" });
        }
        const existingUser = await User.findOne({ name });
        if(existingUser){
            return res.json({ error: "User already exists try different one" });
        }

        // making sure the password is atleast six characters long
        if(password.length < 6){
            return res.status(400).json({ error: "Password should be at least 6 characters long" });
        }

        // hashing the password before saving it to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // creating a new user and saving it to the database
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })

        await newUser.save();

        res.status(201).json({ message: "User registered successfully", user: newUser });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error"});
        console.error(error);
    }
};

export const Login = async (req,res) => {
    try {
        const { email, password } =  req.body;

        // checking if all fields exist or not
        if(!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if(password.length < 6 ) {
            return res.status(400).json({ error: "Password should be at least 6 characters long" });
        }

        // finding the user with the provided email
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ error: "Invalid credentials" });
        }

        // comparing the provided password with the hashed password in the database
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || " ");

        if(!isPasswordCorrect){
            return res.status(404).json({ error: "Invalid credentials" });
        }

        // genarating the jwt token
        const token = jwt.sign({ name: user.name }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.status(200).json({ user: user, token: token });


    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.error(error);
    }
};

export const logout = (req, res) => {
    res.clearCookie('token'); // This clears the token from cookies if stored there (e.g., for sessions).
    res.status(200).json({ message: 'Logged out successfully' });
}
