import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/context';

const CameraAndMicrophone = () => {
    const { videoRef } = useContext(UserContext);
    const [error, setError] = useState(null);

    const startMediaStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing media devices.", err);
            setError("Failed to access camera and/or microphone.");
        }
    };

    useEffect(() => {
        startMediaStream();
    }, [videoRef]);

    return (
        <div>
            {error && <p>{error}</p>}
            <video
                className='rounded mt-1'
                ref={videoRef}
                autoPlay
                playsInline
                width="300"
                height="300"
            />
        </div>
    );
};

export default CameraAndMicrophone;
