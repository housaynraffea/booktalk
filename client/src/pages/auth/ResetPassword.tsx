import '@/common/styles/login.css';

const ResetPassword = () => {
  return (
    <div>
      <div className="center">
        <div className="siteRegister">
          <div className="siteRegisterHeader">
            <h1>Reset Password</h1>
          </div>

          <div className="siteRegisterBody">
            <p>Email</p>
            <input placeholder="email" />

            <p>Password</p>
            <input placeholder="password" type="password" />
            
            <button>Forgot password?</button>

            <button>Reset Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;