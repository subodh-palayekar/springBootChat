import React from 'react'
import "./message.css"

const SelfMessage = ({content,time}) => {
  return (
    <div className='selfMessage-container'>
     <span style={{fontSize:"15px"}}>{content}</span>
     {/* <span className="time">{dateToTime(time)}</span> */}
    </div>
  )
}

export default SelfMessage