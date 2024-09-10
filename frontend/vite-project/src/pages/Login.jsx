import React from "react";
import { Container, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";

const Login = () => {

  console.log('Login.jsx');
  
  const [isLogin, setIsLogin] = useState(true);

  const toogleLogin = () => setIsLogin(false)

  return (
    <Container component={"main"} maxWidth='xs' sx={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          // marginTop: 8
        }}
      >
        {isLogin ? (
          <>
            <Typography variant="h5">Login</Typography>
            <form style={{
              width: "100%",
              marginTop: "1rem",
            }}>
              <TextField
                required
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
              />

              <TextField
                required
                fullWidth
                label="password"
                type="password"
                margin="normal"
                variant="outlined"
              />

              <button
                sx={{
                  marginTop: "1rem",
                }}
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Login
              </button>

              <Typography textAlign={'center'}>OR</Typography>

              <button
                sx={{
                  marginTop: "1rem",
                }}
                type="button"
                variant="contained"
                color="secondary"
                onClick={toogleLogin}
              />

            </form>
          </>
        ) : (
          <span>Register</span>
        )}
      </Paper>
    </Container>
  );
};

export default Login;
