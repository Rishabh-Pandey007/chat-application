import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { VisuallyHiddenInput } from "../components/styles/StyledComponent";
import { bgGradient } from "../constants/color";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";

const Login = () => {

  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");

  const avatar = useFileHandler("single");

  // const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Logging In...");

    setIsLoading(true);
    // const config = {
    //   withCredentials: true,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // };

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Include cookies in the request
    };

    try {
      const { data } = await axios.post(
        `http://localhost:3000/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );
      
      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });

      // redirect to home or dashboard
      window.location.href = "/"; // Adjust the redirect path as needed
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    const config = {
      withCredentials: true,
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
    };

    try {
      const { data } = await axios.post(
        `${server}/user/new`,
        {
          name: name.value,
          bio: bio.value,
          username: username.value,
          password: password.value,
        },
        config
      );

      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: bgGradient,
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isLogin ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleLogin}
              >
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />

                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />

                <Button
                  sx={{
                    marginTop: "1rem",
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                >
                  Login
                </Button>

                <Typography textAlign={"center"} m={"1rem"}>
                  OR
                </Typography>

                <Button
                  disabled={isLoading}
                  fullWidth
                  variant="text"
                  onClick={toggleLogin}
                >
                  Sign Up Instead
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5">Sign Up</Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleSignUp}
              >
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  />

                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "white",
                      bgcolor: "rgba(0,0,0,0.5)",
                      ":hover": {
                        bgcolor: "rgba(0,0,0,0.7)",
                      },
                    }}
                    component="label"
                  >
                    <>
                      <CameraAltIcon />
                      <VisuallyHiddenInput
                        type="file"
                        onChange={avatar.changeHandler}
                      />
                    </>
                  </IconButton>
                </Stack>

                {avatar.error && (
                  <Typography
                    m={"1rem auto"}
                    width={"fit-content"}
                    display={"block"}
                    color="error"
                    variant="caption"
                  >
                    {avatar.error}
                  </Typography>
                )}

                <TextField
                  required
                  fullWidth
                  label="Name"
                  margin="normal"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                />

                <TextField
                  required
                  fullWidth
                  label="Bio"
                  margin="normal"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />

                {username.error && (
                  <Typography color="error" variant="caption">
                    {username.error}
                  </Typography>
                )}

                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />

                <Button
                  sx={{
                    marginTop: "1rem",
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                >
                  Sign Up
                </Button>

                <Typography textAlign={"center"} m={"1rem"}>
                  OR
                </Typography>

                <Button
                  disabled={isLoading}
                  fullWidth
                  variant="text"
                  onClick={toggleLogin}
                >
                  Login Instead
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;




























// import React, { useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useDispatch } from "react-redux";
// import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
// import {
//   Avatar,
//   Button,
//   Container,
//   IconButton,
//   Paper,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { VisuallyHiddenInput } from "../components/styles/StyledComponent";
// import { bgGradient } from "../constants/color";
// import { userExists } from "../redux/reducers/auth";
// import { usernameValidator } from "../utils/validators";

// const Login = () => {
//   const dispatch = useDispatch();

//   const [isLogin, setIsLogin] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);

//   const [name, setName] = useState("");
//   const [bio, setBio] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [avatar, setAvatar] = useState(null);
//   const [avatarPreview, setAvatarPreview] = useState("");

//   const toggleLogin = () => setIsLogin((prev) => !prev);

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setAvatar(file);
//       setAvatarPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const toastId = toast.loading("Logging In...");
//     setIsLoading(true);

//     try {
//       const { data } = await axios.post(
//         `http://localhost:3000/user/login`,
//         { username, password },
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         }
//       );

//       dispatch(userExists(data.user));
//       toast.success(data.message, { id: toastId });
//     } catch (error) {
//       console.error("Login Error:", error);
//       toast.error(
//         error?.response?.data?.message || "Unable to login. Try again.",
//         { id: toastId }
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSignUp = async (e) => {
//     e.preventDefault();

//     if (!usernameValidator(username)) {
//       toast.error("Invalid username. Please check the requirements.");
//       return;
//     }

//     const toastId = toast.loading("Signing Up...");
//     setIsLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("avatar", avatar);
//       formData.append("name", name);
//       formData.append("bio", bio);
//       formData.append("username", username);
//       formData.append("password", password);

//       const { data } = await axios.post(
//         `${process.env.REACT_APP_SERVER_URL}/user/new`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
//         }
//       );

//       dispatch(userExists(data.user));
//       toast.success(data.message, { id: toastId });
//     } catch (error) {
//       console.error("Sign Up Error:", error);
//       toast.error(
//         error?.response?.data?.message || "Unable to sign up. Try again.",
//         { id: toastId }
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div style={{ backgroundImage: bgGradient }}>
//       <Container
//         component="main"
//         maxWidth="xs"
//         sx={{
//           height: "100vh",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Paper
//           elevation={3}
//           sx={{
//             padding: 4,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="h5">{isLogin ? "Login" : "Sign Up"}</Typography>
//           <form
//             style={{ width: "100%", marginTop: "1rem" }}
//             onSubmit={isLogin ? handleLogin : handleSignUp}
//           >
//             {!isLogin && (
//               <>
//                 <Stack position="relative" width="10rem" margin="auto">
//                   <Avatar
//                     sx={{
//                       width: "10rem",
//                       height: "10rem",
//                       objectFit: "contain",
//                     }}
//                     src={avatarPreview}
//                   />
//                   <IconButton
//                     sx={{
//                       position: "absolute",
//                       bottom: 0,
//                       right: 0,
//                       color: "white",
//                       bgcolor: "rgba(0,0,0,0.5)",
//                       ":hover": { bgcolor: "rgba(0,0,0,0.7)" },
//                     }}
//                     component="label"
//                   >
//                     <CameraAltIcon />
//                     <VisuallyHiddenInput
//                       type="file"
//                       onChange={handleAvatarChange}
//                     />
//                   </IconButton>
//                 </Stack>
//                 <TextField
//                   required
//                   fullWidth
//                   label="Name"
//                   margin="normal"
//                   variant="outlined"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//                 <TextField
//                   required
//                   fullWidth
//                   label="Bio"
//                   margin="normal"
//                   variant="outlined"
//                   value={bio}
//                   onChange={(e) => setBio(e.target.value)}
//                 />
//               </>
//             )}
//             <TextField
//               required
//               fullWidth
//               label="Username"
//               margin="normal"
//               variant="outlined"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//             <TextField
//               required
//               fullWidth
//               label="Password"
//               type="password"
//               margin="normal"
//               variant="outlined"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <Button
//               sx={{ marginTop: "1rem" }}
//               variant="contained"
//               color="primary"
//               type="submit"
//               fullWidth
//               disabled={isLoading}
//             >
//               {isLogin ? "Login" : "Sign Up"}
//             </Button>
//             <Typography textAlign="center" m="1rem">
//               OR
//             </Typography>
//             <Button
//               disabled={isLoading}
//               fullWidth
//               variant="text"
//               onClick={toggleLogin}
//             >
//               {isLogin ? "Sign Up Instead" : "Login Instead"}
//             </Button>
//           </form>
//         </Paper>
//       </Container>
//     </div>
//   );
// };

// export default Login;
