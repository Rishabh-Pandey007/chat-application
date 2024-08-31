import React from 'react'
import { Container, Paper } from '@mui/material'

const Login = () => {

    const [isLogin, setIsLogin] = useState(true);

  return <Container component={"main"} maxWidth={"sx"}>
    <Paper elevation={3} sx={{
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // marginTop: 8
    }}>

        {
            isLogin ? <span>Login</span> : <span>Register</span>
        }

    </Paper>
  </Container>
}

export default Login