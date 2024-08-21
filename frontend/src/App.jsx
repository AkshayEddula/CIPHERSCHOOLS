import { useContext, useEffect } from 'react';
import './App.css';
import SignUp from './components/Auth/SignUp';
import SignIn from './components/Auth/SignIn';
import Instructions from './components/test/Instructions';
import ShowTest from './components/test/showTest';
import { UserContext } from './context/context';
import { Routes, Route, useNavigate } from 'react-router-dom';

function App() {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(UserContext);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        } else {
            navigate('auth/login');
        }
    }, [isLoggedIn]);

    return (
        <Routes>
            <Route path='/' element={<Instructions />} />
            <Route path='/auth/signup' element={<SignUp />} />
            <Route path='/auth/login' element={<SignIn />} />
            <Route path='/test/writetest' element={isLoggedIn ? <ShowTest /> : <SignIn />} />
        </Routes>
    );
}

export default App;
