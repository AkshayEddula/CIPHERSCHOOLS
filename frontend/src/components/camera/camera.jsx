import React, { useEffect, useRef } from 'react';

const CameraAndMicrophone = ({ setMediaStream }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const startMediaStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setMediaStream(stream);
                }
            } catch (error) {
                console.error('Failed to access camera and microphone:', error);
            }
        };

        startMediaStream();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, [setMediaStream]);

    return (
        <div>
            <video ref={videoRef} autoPlay muted className="rounded-lg w-64 h-48 bg-black" />
        </div>
    );
};

export default CameraAndMicrophone;
