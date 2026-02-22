import React,{useState} from 'react'
import "../styles/form.scss"
import { Link } from 'react-router'
import axios from 'axios'


const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function handleFormSubmit(e) {
      e.preventDefault();

      axios.post(
        "http://localhost:3000/api/auth/login",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        },
      );
    }





  return (
      <main>
          <div className="form-container">
              <h1>Login</h1>
              <form onSubmit={handleFormSubmit} >
                  <input onInput={(e) => { setUsername(e.target.value) }}  type="text" name='username' placeholder='Enter username' />
                  <input onInput={(e)=>{setPassword(e.target.value)}} type="password" name="password" placeholder='Enter password' />
                  <button type='submit'>Login</button>
              </form>
              <p>Don't have an account?<Link className="toggle-auth-form" to="/register"> Register here</Link></p>
          </div>
    </main>
  )
}

export default Login
