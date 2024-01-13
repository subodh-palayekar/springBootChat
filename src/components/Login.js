import { connect } from "net";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Login = ({ setUserData,connect,setPrivateChats}) => {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const handleformChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevData) => {
      return { ...prevData, [name]: value };
    });
  };

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  const handleUserLogin = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });
      const res = await response.json();
     

      if(res && response.status===200){
        console.log(res);
        setUserData((prevData) => {
            return { ...prevData, "username": res.userName ,"login":true};
        });

        const storedMapString = localStorage.getItem(res.userName);
        const storedMapArray = JSON.parse(storedMapString);
        const storedMap = new Map(JSON.parse(storedMapArray))
        console.log(storedMap);
        setPrivateChats(storedMap);


      }
      
    } catch (error) {
      console.log(error);
    } 
  };
  return (
    <div className="register-container">
      <span>Log In</span>
      <input
        type="text"
        name="userName"
        required
        value={userInfo.userName}
        placeholder="Enter you Username"
        onChange={handleformChange}
      />
      <input
        type="password"
        name="password"
        required
        value={userInfo.password}
        placeholder="Enter you Password"
        onChange={handleformChange}
      />
      <button onClick={handleUserLogin}>
        {loading ? "Loading..." : " Start Chatting"}
      </button>
      <Link style={{ alignSelf: "center" }} to={"/register"}>
        {" "}
        Register Now{" "}
      </Link>
    </div>
  );
};

export default Login;
