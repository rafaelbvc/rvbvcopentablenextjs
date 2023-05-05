"use client";

import { useEffect, useState, useContext } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AuthModalInput from "./authModalInput";
import useAuth from "../../hooks/useAuth";
import { AuthenticationContext } from "../context/AuthContext";
import LinearDeterminate from "./loadingMui";
import { Alert } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "25rem",
  height: "40rem",
  bgcolor: "background.paper",
  border: "0.1rem solid #000",
  boxShadow: "25rem",
  p: 4,
  textAlign: "center",
};

function AuthModal({
  isSignin,
}: {
  isSignin: boolean;
}) {
  const { signin, signup } = useAuth();
  const { loading, data, error } = useContext(AuthenticationContext);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [disabled, setDisabled] = useState(true);
  const [inputData, setInputData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });

  const handleSigninSignup = (signInContent: string, signUpContent: string) => {
    return isSignin ? signInContent : signUpContent;
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = () => {
    if (isSignin) {
      signin(
        { email: inputData.email, password: inputData.password },
        handleClose
      );
    } else {
      signup(inputData, handleClose)
    }
  };

  useEffect(() => {
    if (isSignin) {
      if (inputData.password && inputData.email) {
        return setDisabled(false);
      }
    } else {
      if (
        inputData.firstName &&
        inputData.lastName &&
        inputData.city &&
        inputData.phone &&
        inputData.email &&
        inputData.password
      ) {
        return setDisabled(false);
      }
    }
    return setDisabled(true);
  }, [inputData]);

  return (
    <div>
      <button
        className={`${handleSigninSignup(
          "bg-blue-400 text-white",
          ""
        )} border p-1 px-4 rounded mr-3`}
        onClick={() => setOpen(true)}
      >
        {handleSigninSignup("Sign in", "Sign up")}
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {loading ? (
            <div className="px-0.5 pt-10 w-[25rem] h-[40rem] flex ">
              <LinearDeterminate />
            </div>
          ) : (
            <div className="p-2">
              {error ? (
                <Alert severity="error" className="mb-4">
                  {error}
                </Alert>
              ) : null}
              <div className="uppercase font-bold text-center pb-2 border-b mb-2">
                <p className="text-sm">
                  {handleSigninSignup("SING IN", "CREATE ACCOUNT")}
                </p>
              </div>
              <div className="m-auto">
                <h2 className="text-2xl font-light text-center">
                  {handleSigninSignup(
                    "Log Into Your Account",
                    "Create Your OpenTable Account"
                  )}
                </h2>
                <AuthModalInput
                  inputData={inputData}
                  handleChangeInput={handleChangeInput}
                  isSignin={isSignin}
                />
                <button
                  className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400"
                  disabled={disabled}
                  onClick={handleClick}
                >
                  {handleSigninSignup("Sign In", "Create Account")}
                </button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
export default AuthModal;
