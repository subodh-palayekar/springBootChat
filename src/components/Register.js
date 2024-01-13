import React, { useEffect, useState } from 'react'
import {Link, useNavigate} from "react-router-dom"


const Register = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleformChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => {
      return { ...prevData, [name]: value };
    });
  };

  useEffect(()=>{
    console.log(userData);
  },[userData])

  const handleUserRegister = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const res = await response.json();
      console.log(res);
      navigate('/')
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="register-container">
      <span>Register Now</span>
      <input
        type="text"
        name="userName"
        placeholder="Enter you Username"
        onChange={handleformChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Enter you Password"
        onChange={handleformChange}
      />
      <button onClick={handleUserRegister}>
        {loading ? "Loading..." : "Register Now"}
      </button>
      <Link style={{alignSelf:"center"}} to={'/'}>log In</Link>
    </div>
  );
}

export default Register
