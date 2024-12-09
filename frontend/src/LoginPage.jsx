import { useNavigate } from 'react-router-dom';




function LoginPage(){
    const navigate = useNavigate();
    const goToBoard = () => {
        navigate('/board');
      };
    

    return(
        <>
            <h1>Login here!</h1>
            <button onClick={goToBoard}>Go to Board</button>
            
        </>
        
    )
}

export default LoginPage