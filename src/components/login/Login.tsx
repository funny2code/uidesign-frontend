import { useEffect, useState } from "react";
import { useSession } from "../auth/useSession";
import { OpenAPI } from "../../client";

const HOME = "/";

const LoginForm = ({ api_url = undefined }: { api_url?: string }) => {
  OpenAPI.BASE = api_url || OpenAPI.BASE;
  const [isSignUp, setIsSignUp] = useState(false);
  const { getSession, setSession } = useSession();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  // const [confirmEmail, setConfirmEmail ] = useState<string>('');
  const [password, setPassword] = useState<string>("");
  // const [confirmPassword, setConfirmPassword ] = useState<string>('');
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSubmitSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (email === '' || email !== confirmEmail) {
    //     return setError("Emails do not match.");
    // }
    // if (password === '' || password !== confirmPassword) {
    //     return setError("Passwords do not match.");
    // }
    const url = `${OpenAPI.BASE}/auth/noflow/signup`;
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        username: username,
        email: email,
        confirm_email: email,
        password: password,
        confirm_password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        response.json().then(data => setError(data.detail));
        setIsLoading(false);
        throw new Error("Something went wrong");
      })
      .then(data => {
        setSuccess("Successfully created account!");
        setError("");
        setUsername("");
        setEmail("");
        // setConfirmEmail('');
        setPassword("");
        // setConfirmPassword('');
        setIsSignUp(false);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = `${OpenAPI.BASE}/auth/noflow/login`;
    setIsLoading(true);
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        response.json().then(data => setError(data.detail));
        setIsLoading(false);
        throw new Error("Something went wrong");
      })
      .then(data => {
        setIsLoading(false);
        setSession(data);
        setError("");
        setUsername("");
        setPassword("");
        window.location.href = HOME;
      })
      .catch(err => {
        console.log(err);
      });
  };
  const handlePageChange = (set: boolean) => {
    setIsSignUp(set);
    setError("");
    setSuccess("");
  };
  return (
    <>
      {isSignUp ? (
        <form id="signup-form" onSubmit={handleSubmitSignup} className="vstack gap-3 form">
          <legend>Sign Up</legend>
          {/* <div>
                        <label className="form-label">Username</label>
                        <input className="form-control" type="text" placeholder="displayName" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div> */}
          <div className="vstack gap-1">
            <label className="form-label">Email Address</label>
            <input
              className="form-control"
              type="email"
              placeholder="email@google.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {/* <input className="form-control" type="email" placeholder="confirm email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} /> */}
          </div>
          <div className="vstack gap-1">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {/* <input className="form-control" type="password" placeholder="confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /> */}
            <span className="form-text text-muted">
              At least 8 characters, lower case, upper case, and symbols.
            </span>
          </div>
          <div className="vstack gap-3">
            <span className="form-text text-danger">{error && error}</span>
            <a
              className="text-success"
              style={{ cursor: "pointer" }}
              onClick={() => handlePageChange(false)}
            >
              Back to Login
            </a>
            <button className="btn btn-primary" type="submit">
              Sign up
            </button>
          </div>
        </form>
      ) : (
        <form id="login-form" onSubmit={handleSubmitLogin} className="vstack gap-3 form">
          <legend>Login</legend>
          <div className="vstack gap-1">
            <label className="form-label">Email Address</label>
            <input
              className="form-control"
              type="text"
              placeholder="email@google.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="vstack gap-1">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="vstack gap-3">
            <span className="form-text text-success">{success && success}</span>
            <span className="form-text text-danger">{error && error}</span>
            <a
              className="text-success"
              style={{ cursor: "pointer" }}
              onClick={() => handlePageChange(true)}
            >
              Create Account
            </a>
            {isLoading ? (
              <div id="loading" className="spinner-border" role="status"></div>
            ) : (
              <button className="btn btn-primary" type="submit">
                Login
              </button>
            )}
          </div>
        </form>
      )}
    </>
  );
};

export default LoginForm;
