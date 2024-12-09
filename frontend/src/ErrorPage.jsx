
import { useNavigate } from 'react-router-dom';

function ErrorPage(){
    const navigate = useNavigate()

    const goToLogin = ()=>{
        navigate("/")
    }
    return(
        <div>
            <button onClick={goToLogin}>Go back to Login</button>
        </div>
    )
}

export default ErrorPage