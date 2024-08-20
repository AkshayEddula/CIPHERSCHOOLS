import React, { useContext, useRef, useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import { UserContext } from '../../context/context';
import { Link } from 'react-router-dom';

// Instruction Section
const InstructionSection = ({ title, points }) => (
    <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <div className='flex flex-col ml-4'>
            {points.map((point, index) => (
                <li key={index} className="text-base mb-1">{point}</li>
            ))}
        </div>
    </div>
);

const Instructions = () => {
    const { instructionsData, videoRef } = useContext(UserContext);
    const [error, setError] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [allowMedia, setAllowMedia] = useState(false);

    const handleMediaPermission = async () => {
        try {
            // Clean up existing stream if any
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }

            // Request new media stream
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play();
                };
            }

            setAllowMedia(true);
        } catch (error) {
            console.log(error);
            setError('Failed to access your camera and microphone');
            setAllowMedia(false);
        }
    };

    const handleCheckboxChange = (e) => {
        if (e.target.name === "instructions") {
            setIsChecked(!isChecked);
        }
    };

    // Cleanup media stream on component unmount
    useEffect(() => {
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, [videoRef]);

    return (
        <div>
            <Nav />
            <div>
                <div className='flex flex-col items-center mt-5 mb-5'>
                    <h1 className='text-2xl font-extrabold'>Instructions</h1>
                    <div className="bg-purple-100 p-5 px-7 mt-5 rounded-md max-h-96 overflow-y-auto w-full max-w-2xl">
                        {instructionsData.map((section, index) => (
                            <InstructionSection key={index} title={section.title} points={section.points} />
                        ))}
                        <div className="mt-4">
                            <label className="flex items-center text-xl font-semibold">
                                <input
                                    type="checkbox"
                                    name="instructions"
                                    checked={isChecked}
                                    onChange={handleCheckboxChange}
                                    className="mr-2"
                                />
                                I have read and understood the instructions.
                            </label>
                        </div>
                    </div>

                    {/* Media access section */}
                    <div className='mt-3 flex flex-col items-center gap-3'>
                        <button
                            onClick={handleMediaPermission}
                            className='bg-purple-400 text-xl text-white font-medium p-2 px-4 rounded'
                        >
                            Allow Access to Camera and Microphone
                        </button>
                        <button
                            className={`bg-purple-500 text-2xl text-white font-medium p-2 px-4 rounded ${!isChecked || !allowMedia ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!isChecked || !allowMedia}
                        >
                            <Link to="/test/writetest">Start Test</Link>
                        </button>
                    </div>

                    {/* Error handling */}
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </div>
                <div className='absolute bottom-0 right-5'>
                    {allowMedia && (
                        <div className="mt-4">
                            <h1 className='text-xl font-semibold'>Camera Preview</h1>
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                className="rounded-lg w-64 h-48 bg-black"
                                style={{ display: allowMedia ? 'block' : 'none' }} // Ensure visibility
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Instructions;
