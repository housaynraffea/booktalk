import '@/common/styles/login.css';

const UpdatePassword = () => {
  return (
    <div>
      <div className="center">
        <div className="siteRegister">
          <div className="siteRegisterHeader">
            <h1>Update Password</h1>
          </div>

          <div className="siteRegisterBody">
            <p>Email</p>
            <input placeholder="email" />

            <p>Password</p>
            <input placeholder="password" type="password" />
            
            <button>Forgot password?</button>

            <button>Update Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;