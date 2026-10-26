import '@/common/styles/login.css';
import { Link } from 'react-router-dom';

const SignIn = () => {
  return (
    <div>
      <div className="center">
        <div className="siteRegister">
          <div className="siteRegisterHeader">
            <h1>Sign In</h1>
          </div>

          <div className="siteRegisterBody">
            <div className="siteEmail">
              <p>Email</p>
              <input placeholder="Email" />
            </div>

            <div className="sitePassword">
              <p>Password</p>
              <input placeholder="Password" type="password" />
              <div className="siteHelpLinks">
                <Link to="/reset-password">(Forgot Password?)</Link>
                <p> | </p>
                <Link to="/sign-up">(Don't have an account?)</Link>
              </div>
            </div>
          </div>

          <div className="siteRegisterFooter">
            <button>Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;