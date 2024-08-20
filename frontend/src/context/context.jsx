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
                "Please ensure you have a stable internet connection before starting.",
                "Make sure to complete the test in one sitting, as the test cannot be resumed once exited."
            ]
        },
        {
            title: "Starting the Test",
            points: [
                "Once you click Start Test, the timer will begin. Ensure you are ready, as the timer cannot be paused.",
                "You will not be able to revisit previous questions, so make sure your answer is final before moving on.",
                "Read each question carefully before selecting your answer."
            ]
        },
        {
            title: "During the Test",
            points: [
                "Ensure you are in a quiet environment to minimize distractions.",
                "If you encounter any technical issues, try refreshing the page, but be aware that the timer will continue running.",
                "Use the 'Next' button to proceed to the next question after answering."
            ]
        },
        {
            title: "Submitting the Test",
            points: [
                "Once all questions are answered, click on the Submit button to complete the test.",
                "You cannot modify your answers after submission, so review your responses carefully.",
                "Make sure you have answered all questions; unanswered questions will be marked as incorrect."
            ]
        },
        {
            title: "Test Results",
            points: [
                "Your test results will be available immediately after submission or sent to your registered email.",
                "Review your results to understand your strengths and areas for improvement.",
                "If you have any questions or concerns about your results, contact the support team."
            ]
        },
        {
            title: "Additional Notes",
            points: [
                "Do not attempt to cheat or use unauthorized resources; the test is monitored, and any suspicious activity may lead to disqualification.",
                "Ensure your device is fully charged or connected to a power source to avoid disruptions during the test.",
                "If you need special accommodations, please notify the test administrator before starting the test."
            ]
        }
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
            axios.get('https://cipherschools-uaa0.onrender.com/auth/verifyToken', {
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
        axios.get('https://cipherschools-uaa0.onrender.com/auth/logout')
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
