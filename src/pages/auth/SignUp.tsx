import '@/common/styles/login.css';
import { Link } from 'react-router-dom';

const SignUp = () => {
  return (
    <div>
      <div className="center">
        <div className="siteRegister">
          <div className="siteRegisterHeader">
            <h1>Sign Up</h1>
          </div>

          <div className="siteRegisterBody">
            <p>Email</p>
            <input placeholder="email" />

            <p>Password</p>
            <input placeholder="password" type="password" />

            <div className="siteHelpLinks">
              <Link to="/sign-in">(Already have an account?)</Link>
            </div>

            <div className="siteRegisterFooter">
              <button>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;