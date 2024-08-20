import { createContext, useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const UserContext = createContext();

export const ContextProvider = ({ children }) => {
    // User Signup Data and input handleChange Functions
    const [data, setData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    // User Signin Data and input handleChange Functions
    const [signinData, setSigninData] = useState({
        email: '',
        password: ''
    });

    const handleSigninChange = (e) => {
        setSigninData({ ...signinData, [e.target.name]: e.target.value });
    };

    // Instruction Data
    const instructionsData = [
        {
            title: "Test Overview",
            points: [
                "The test you selected is designed to assess your knowledge and skills in the specified area.",
                "Please ensure you have a stable internet connection before starting."
            ]
        },
        {
            title: "Starting the Test",
            points: [
                "Once you click Start Test, the timer will begin. Ensure you are ready, as the timer cannot be paused.",
                "You will not be able to revisit previous questions, so make sure your answer is final before moving on."
            ]
        },
        // ... (Other instructions)
    ];

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [testQuestions, setTestQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [submissionData, setSubmissionData] = useState({
        testId: '',
        userId: '',
        selections: [],
        endedAt: Date.now()
    });
    const [user, setUser] = useState("");
    const [userId, setUserId] = useState("");
    const videoRef = useRef(null);
    const navigate = useNavigate();

    // Token verification function
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        if (token) {
            axios.get('http://localhost:5000/auth/verifyToken', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then((res) => {
                    if (res.status === 200) {
                        setIsLoggedIn(true);
                        if (storedUserId) {
                            setUserId(storedUserId);
                        }
                    }
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    setIsLoggedIn(false);
                });
        }
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userData._id);
        setIsLoggedIn(true);
        setUser(userData);
        setUserId(userData._id);
    };

    const logout = () => {
        axios.get('http://localhost:5000/auth/logout')
            .then(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                setIsLoggedIn(false);
                setUser(null);
                setUserId("");
                navigate('/auth/login');
            })
            .catch(err => console.log(err));
    };

    const handleOptionChange = (questionId, option) => {
        const now = new Date().toISOString();
        setSelectedAnswers((prevAnswers) => {
            const updatedAnswers = prevAnswers.filter(answer => answer.questionId !== questionId);
            return [...updatedAnswers, { questionId, option, savedAt: now }];
        });
    };

    return (
        <UserContext.Provider value={{
            data, setData, handleChange, isLoggedIn, setIsLoggedIn,
            signinData, handleSigninChange, login, logout,
            instructionsData, testQuestions, setTestQuestions,
            selectedAnswers, setSelectedAnswers, videoRef,
            handleOptionChange, submissionData, setSubmissionData, userId
        }}>
            {children}
        </UserContext.Provider>
    );
};
