import React, { useState } from "react";

function Auth({ close, onUserChange }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");

  function switchMode(mode) {
    setIsLogin(mode);
    setMessage("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
  }

  async function submit(e) {
    e.preventDefault();
    setMessage("");

    if (!isLogin && password !== confirmPassword) {
      return setMessage("Passwords do not match");
    }

    const url = isLogin
      ? "http://localhost:3000/login"
      : "http://localhost:3000/users";

    const body = isLogin
      ? { email, password }
      : {
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        if (!isLogin) {
          alert("Registered! Please login.");
          switchMode(true);
          return;
        }

        alert(`Welcome ${data.user.first_name}`);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (onUserChange) onUserChange(data.user);
        close();
      } else {
        setMessage(data.error || "Error");
      }
    } catch {
      setMessage("Server error");
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.box}>
        
        <button onClick={close} style={styles.close}>✕</button>

        <h2 style={styles.title}>
          {isLogin ? "Sign In" : "Sign Up"}
        </h2>

        <form onSubmit={submit} style={styles.form}>

          {message && <div style={styles.error}>{message}</div>}

          {!isLogin && (
            <div style={styles.row}>
              <input
                style={styles.input}
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                style={styles.input}
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          )}

          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {!isLogin && (
            <input
              style={styles.input}
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          <button style={styles.button}>
            {isLogin ? "Sign In" : "Create account"}
          </button>

          <p style={styles.switch}>
            {isLogin ? (
              <>
                Don't have an account?
                <span
                  style={styles.link}
                  onClick={() => switchMode(false)}
                >
                  Sign up
                </span>
              </>
            ) : (
              <>
                Already have an account?
                <span
                  style={styles.link}
                  onClick={() => switchMode(true)}
                >
                  Sign in
                </span>
              </>
            )}
          </p>

        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "340px",
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    position: "relative",
  },
  close: {
    position: "absolute",
    right: "12px",
    top: "10px",
    border: "none",
    background: "none",
    fontSize: "18px",
    cursor: "pointer",
  },
  title: {
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  row: {
    display: "flex",
    gap: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "2px solid #ddd",
    outline: "none",
  },
  button: {
    background: "#2563eb",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  switch: {
    textAlign: "center",
    fontSize: "14px",
  },
  link: {
    color: "#2563eb",   // КӨК
    cursor: "pointer",  // ҚОЛ
    marginLeft: "5px",
    fontWeight: "500",
  },
  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "8px",
    borderRadius: "8px",
    textAlign: "center",
  },
};

export default Auth;