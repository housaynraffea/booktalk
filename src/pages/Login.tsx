import '@/common/styles/login.css';


const Login = () => {
  return (
    <div>
        <div className="siteRegister">
          <div className="siteRegisterHeader">
            <h1>Login</h1>
          </div>

          <div className="siteRegisterBody">
            <p>Email</p>
            <input placeholder="email" />

            <p>Password</p>
            <input placeholder="password" type="password" />
            
            <button>Forgot password?</button>

            <button>Log in</button>
          </div>
        </div>
    </div>
  );
};

export default Login;