import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

import { useSelector, useDispatch } from "react-redux";
import { set_register_dialog, set_login_dialog } from "../features/user/dialog";
import type { RootState } from "../store/store";

import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";
import axiosInstance from "../axiosConfig";
import zIndex from "@mui/material/styles/zIndex";

export default function HomePage() {
  const dispatch = useDispatch();

  interface FormData {
    username: string;
    password: string;
  }
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    handleErrorChange();
  };

  const registerDialog = useSelector(
    (state: RootState) => state.registerDialog.value
  );
  const LoginDialogState = useSelector(
    (state: RootState) => state.LoginDialog.value
  );

  const handleErrorChange = () => {
    const validationErrors: any = {};
    if (!formData.username.trim()) {
      validationErrors.username = "username is required";
    }

    if (!formData.password.trim()) {
      validationErrors.password = "password is required";
    } else if (formData.password.length < 6) {
      validationErrors.password = "password should be at least 6 char";
    }

    setErrors(validationErrors);
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(handleErrorChange()).length === 0) {
      const payload = {
        username: formData.username,
        password: formData.password,
        role: [1]
      };
      await axiosInstance
        .post("/api/users", payload)
        .then((response) => {
          setTimeout(() => {
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "Registration successful!",
            });
          }, 1000);
          RegisterClose();
        })
        .catch((error) => {
          if (error.response.status === 400) {
            const message = error.response.data.message;
            Swal.fire({
              icon: "error",
              title: "Registration failed",
              text: message,
            });
            return;
          }
        });
    }
  };
  const login = async (e) => {
    e.preventDefault();
    if (Object.keys(handleErrorChange()).length === 0) {
      const payload = {
        username: formData.username,
        password: formData.password,
      };
      await axiosInstance
        .post("/api/login", payload)
        .then((response) => {
          localStorage.setItem("mff", response.data.token);
          if (response.status === 200) {
            setTimeout(() => {
              Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Login successfully!",
              });
            }, 1000)
            LoginClose()
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            const message = error.response.data.message;
            Swal.fire({
              icon: "error",
              title: "Invalid Username or Password!",
              text: message,
            });
            return;
          }
        });
    }
  };

  const RegisterClose = () => {
    setFormData({ username: "", password: "" });
    dispatch(set_register_dialog(false));
  };

  const LoginClose = () => {
    dispatch(set_login_dialog(false));
  };

  const topics = [
    "Education",
    "Learning Tools",
    "Cognitive Enhancement",
    "Personal Development",
    "Educational Apps",
    "Study Resources",
    "Online Study Aids",
    "Digital Learning",
    "Memory Improvement",
    "Academic Support",
  ];

  return (
    <div>
      <React.Fragment>
        <div className="flex flex-col  h-full w-full  p-8 mt-8">
          <div className="flex flex-col  md:flex-row-reverse h-full w-full">
            <img
              className="w-3/4 md:w-1/4  m-auto"
              src="images/bg.jpg"
              alt="app"
            />
            <div className="flex flex-col gap-2 md:bg-white md:drop-shadow-xl p-2">
              <p className="self-start md:self-center  text-4xl pt-8">
                {" "}
                Memo Flash
              </p>
              <p className="self-start   text-xl">
                Introducing FlashMind: Your personalized digital memory palace!
                Revolutionize your learning with our web-based flashcard
                application. Seamlessly create, organize, and review flashcards
                anytime, anywhere. Boost your retention, master subjects faster,
                and ace exams effortlessly. Start your journey to knowledge
                mastery today with FlashMind!
              </p>
            </div>
          </div>
          <div className="flex flex-row flex-wrap gap-1">
            {/* Use Array.map to generate multiple instances of the inner div */}
            {topics.map((topic, index) => (
              <div
                key={index} // Ensure each instance has a unique key
                style={{ width: "10rem", height: "5rem" }}
                className="enlarge grow flex items-center justify-center bg-white text-center shadow-xl rounded-lg p-2"
              >
                {topic}
              </div>
            ))}
          </div>
        </div>
        {/* register dialog */}
        <Dialog
          open={registerDialog}
          onClose={RegisterClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          style={{ zIndex: "0" }}
        >
          <DialogTitle id="alert-dialog-title">
            <div className="text-center">{"User Registration"}</div>
          </DialogTitle>
          <DialogContent>
            <form>
              <div className="flex flex-col gap-2 p-2">
                <TextField
                  label="Username"
                  variant="outlined"
                  name="username"
                  error={!!errors.username}
                  onChange={handleChange}
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  name="password"
                  error={!!errors.password}
                  type="password"
                  onChange={handleChange}
                />
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            <div className="w-full flex flex-row justify-center gap-2 pb-4">
              <Button variant="contained" onClick={RegisterClose}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSubmit} autoFocus>
                Submit
              </Button>
            </div>
          </DialogActions>
        </Dialog>
        {/* login dialog */}
        <Dialog
          open={LoginDialogState}
          onClose={LoginClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          style={{ zIndex: "0" }}
        >
          <DialogTitle id="alert-dialog-title">
            <div className="text-center">{"Login"}</div>
          </DialogTitle>
          <DialogContent>
            <form>
              <div className="flex flex-col gap-2 p-2">
                <TextField
                  label="Username"
                  variant="outlined"
                  name="username"
                  error={!!errors.username}
                  onChange={handleChange}
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  name="password"
                  error={!!errors.password}
                  type="password"
                  onChange={handleChange}
                />
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            <div className="w-full flex flex-row justify-center gap-2 pb-4">
              <Button variant="contained" onClick={LoginClose}>
                Cancel
              </Button>
              <Button variant="contained" onClick={login} autoFocus>
                Submit
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
}
