import React from 'react'
import "./message.css"


const OtherMessage = ({content,isGroupM,senderName,time}) => {
  return (
    <div className='otherMessage-container'>
    {isGroupM && <span className='sender-name'>{senderName}</span>}
    <span className='other-message'>{content}</span>
    </div>
  )
}

export default OtherMessage