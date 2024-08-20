import jwt from 'jsonwebtoken';

//  middleware to verify jwt credentials

export const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // verifying token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = user;
        next();
    })

}
