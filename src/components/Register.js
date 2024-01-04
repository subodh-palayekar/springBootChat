import React from 'react'

const Register = ({registerUser,handleUsername,loading}) => {
  return (
    <div className='register-container'>
        <span>Register Now</span>
        <input type='text' placeholder='Enter you Name' onChange={handleUsername} />
        <button onClick={registerUser} >{loading ? "Loading..." : " Start Chatting"}</button>
    </div>
  )
}

export default Register
