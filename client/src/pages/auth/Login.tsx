import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/common/context/AuthContext";
import { PASSWORD_MIN } from "@/api/auth";
import { USERNAME_MIN, USERNAME_MAX, USERNAME_PATTERN, validateUsername, validateDisplayName } from "@/api/account";
import "@/common/styles/login.css"

type Mode = 'signin' | 'signup';
type Message = { kind: 'error' | 'success'; text: string} | null;

const Login = () => {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading, login, register, logout } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  const switchMode = (next: Mode) => {
    setMode(next);
    setMessage(null);
    setPassword('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    
    if (mode === 'signup') {
      const problem = validateDisplayName(displayName) ?? validateUsername(username);
      if (problem) {
        setMessage({ kind: 'error', text: problem});
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (mode === 'signin') {
        await login(email, password);
      } 
      else {
        await register({
          email,
          username: username.trim(),
          display_name: displayName.trim(),
          password,
        });
      }
      navigate("/");
    }
    catch (error) {
      const text = error instanceof Error ? error.message : "Something went wrong!";
      setMessage({ kind: 'error', text});
    }
    finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) return null;

  if (user) {
    return (
      <div className="auth">
        <main className="auth-card">
          <h1 className="auth-title">Signed in!</h1>
          <p>You are now signed in as <strong>{user.display_name}</strong> (@{user.username})!</p>
          <div className="auth-actions">
            <Link className="auth-submit" to={`/profile/${user.username}`}>Go to profile</Link>
            <button type="button" className="auth-link" onClick={logout}>Sign out</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="auth">
      <main className="auth-card">
        <h1>{mode === 'signin' ? 'Sign in' : 'Create an Account'}</h1>
        
        <div className="auth-tabs" role="tablist" aria-label="Authentication Options">
          <button type="button" role="tab" aria-selected={mode === 'signin'} onClick={() => switchMode('signin')} disabled={isSubmitting}>Sign In</button>
          <button type="button" role="tab" aria-selected={mode === 'signup'} onClick={() => switchMode('signup')} disabled={isSubmitting}>Sign Up</button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">Email<input type="email" name="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}/> </label>

          { mode === 'signup' && (
            <>
              <label className="auth-field">Display Name<input type="text" name="displayName" required value={displayName} onChange={(e) => setDisplayName(e.target.value)}/> </label>
              <label className="auth-field">Username<input type="text" name="username" autoComplete="username" required minLength={USERNAME_MIN} maxLength={USERNAME_MAX} pattern={USERNAME_PATTERN.source} spellCheck={false} value={username} onChange={(e) => setUsername(e.target.value)}/> </label>
            </>
          )}

          <label className="auth-field">Password<input type="password" name="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} required minLength={PASSWORD_MIN} value={password} onChange={(e) => setPassword(e.target.value)}/></label>
          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {message && <p className={`auth-message-${message.kind}`}>{message.text}</p>}
      </main>
    </div>
  );
};

export default Login;