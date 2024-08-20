import React, { useContext, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { UserContext } from '../../context/context.jsx';
import axios from 'axios';
import Timer from '../Timer.jsx';
import CameraAndMicrophone from '../camera/camera.jsx';
import { useNavigate } from 'react-router-dom';

const retrieveTest = async (id) => {
    const response = await axios.get(`https://cipherschools-uaa0.onrender.com/test/writetest/${id}`);
    return response.data;
};

const ShowTest = () => {
    const testId = '66c476e15b80247516f4be45'; // sample test id
    const { setTestQuestions, selectedAnswers, handleOptionChange, submissionData, setSubmissionData, userId } = useContext(UserContext);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [visitedQuestions, setVisitedQuestions] = useState(new Set());
    const [name, setname] = useState();
    const [mediaStream, setMediaStream] = useState(null); // Track media stream
    const navigate = useNavigate();

    const { data: testData, error, isLoading } = useQuery(
        ['testData', testId],
        () => retrieveTest(testId),
        {
            onSuccess: (data) => {
                setTestQuestions(data.questions);
            },
        }
    );

    const handleTimeUp = () => {
        alert("Time's up! The test will be submitted.");
    };

    const mutation = useMutation(
        (submissionData) => axios.post('https://cipherschools-uaa0.onrender.com/test/writetest/submittest', submissionData),
        {
            onSuccess: () => {
                alert("Test submitted successfully");
                stopMediaStream(); // Stop media stream on successful submission
                navigate('/');
            },
        }
    );

    const handleOptionChangeLocal = (option) => {
        const questionId = testData.questions[currentQuestionIndex]._id;
        handleOptionChange(questionId, option);
    };

    const handleQuestionClick = (index) => {
        setVisitedQuestions((prev) => new Set(prev.add(index)));
        setCurrentQuestionIndex(index);
    };

    const submitHandle = () => {
        const submission = { testId: testId, userId: userId, selections: selectedAnswers };
        setSubmissionData(submission);
        console.log(submission);
        mutation.mutate(submission);
    };

    // Function to stop media stream
    const stopMediaStream = () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            setMediaStream(null);
        }
    };

    if (isLoading) return <div className='text-2xl text-center'>Fetching test data...</div>;
    if (error) return <div>An error occurred: {error.message}</div>;

    const currentQuestion = testData.questions[currentQuestionIndex];
    const answer = selectedAnswers.find(answer => answer.questionId === currentQuestion._id);

    return (
        <>
            <div className='text-center bg-red-400 text-white'>
                Dont Refresh the Test You might Lose The progress
            </div>
            <div className='flex justify-between gap-12 items-start bg-white p-8 h-screen'>
                <div className='h-full w-3/5'>
                    <div className='text-[36px] font-semibold text-gray-800'>Online Test - Sample Test</div>
                    <div className='flex flex-col gap-10 mt-8'>
                        <div className='flex flex-col gap-4'>
                            <h1 className='text-lg font-medium text-gray-600'>Question {currentQuestionIndex + 1}</h1>
                            <hr className='border-gray-300' />
                            <h2 className='text-xl font-medium text-gray-800'>{currentQuestion.question}</h2>
                            <div className='flex flex-col gap-2 mt-4'>
                                {currentQuestion.options.map((option, index) => (
                                    <label className='flex items-center gap-3 text-gray-700' key={index}>
                                        <input
                                            type="radio"
                                            name={`question-${currentQuestionIndex}`}
                                            value={option}
                                            checked={answer?.option === option}
                                            onChange={() => handleOptionChangeLocal(option)}
                                            className='accent-purple-400'
                                        />
                                        {String.fromCharCode(65 + index)}. {option}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <button className='p-2 bg-gray-200 text-gray-600 rounded text-lg font-medium'>Mark for review</button>
                            <button className='p-2 bg-purple-400 text-white rounded text-lg font-medium'
                                onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                                disabled={currentQuestionIndex === 0}
                            >
                                Previous
                            </button>
                            <button className='p-2 px-4 bg-purple-400 text-white rounded text-lg font-medium'
                                onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, testData.questions.length - 1))}
                                disabled={currentQuestionIndex === testData.questions.length - 1}
                            >
                                Next
                            </button>
                            <button onClick={submitHandle} className='p-2 bg-green-400 text-white text-lg font-medium rounded'>Submit Test</button>
                        </div>
                    </div>
                </div>
                <div className='w-2/5'>
                    <div className='bg-gray-100 p-4 rounded shadow-md mb-8'>
                        <Timer onTimeUp={handleTimeUp} />
                    </div>
                    <div className='bg-gray-100 p-4 rounded shadow-md'>
                        <h1 className='text-lg font-medium text-gray-800'>Questions</h1>
                        <div className='grid grid-cols-5 gap-2 mt-4'>
                            {testData.questions.map((ques, index) => (
                                <button
                                    key={ques._id}
                                    onClick={() => handleQuestionClick(index)}
                                    className={`p-2 rounded text-lg font-medium
                                    ${selectedAnswers.some(answer => answer.questionId === ques._id) ? 'bg-green-400 text-white' :
                                            visitedQuestions.has(index) ? 'bg-red-400 text-white' :
                                                index === currentQuestionIndex ? 'bg-purple-400 text-white' : 'bg-gray-200 text-gray-600'}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className='absolute bottom-5 right-5'>
                        <CameraAndMicrophone setMediaStream={setMediaStream} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShowTest;
