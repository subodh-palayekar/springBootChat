import React, { useEffect, useState } from 'react'
import OtherMessage from './message/OtherMessage'
import SelfMessage from './message/SelfMessage'
import Register from './Register';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
var stompClient = null;
const Chatapp = () => {

    const[privateChats,setPrivateChats] = useState(new Map())
    const [loading,setLoading] = useState(false);
    const[publicChats,setPublicChats] = useState([])
    const [tab,setTab] =useState("CHATROOM");
    const [userData,setUserData] = useState({
        username:"",
        receiverName:"",
        connected:false,
        message:''
    })

    // useEffect(()=>{
    //     console.log(userData,privateChats);
    // },[userData])

    const connect=()=>{
        setLoading(true)
        let Sock = new SockJS("http://localhost:8080/ws");
        stompClient = over(Sock); 
        stompClient.connect({},onConnected,onError);
    }

    const onConnected=()=>{
        setUserData({...userData,"connected":true});
        stompClient.subscribe('/chatroom/public',onPublicMessagedReceived);
        stompClient.subscribe('/user/'+userData.username+'/private',onPrivateMessage);
        userJoin();
    }

    const userJoin=()=>{

        const chatMessage={
            senderName:userData.username,
            status:"JOIN"
        };
        stompClient.send("/app/message",{},JSON.stringify(chatMessage));
    }

    const onPublicMessagedReceived =(payload)=>{
        const payloadData = JSON.parse(payload.body);
        switch(payloadData.status){
            case "JOIN":
                if(!privateChats.get(payloadData.senderName)){
                    privateChats.set(payloadData.senderName,[])
                    setPrivateChats(new Map(privateChats))
                }
                break;
            case "MESSAGE":
                // publicChats.push(payloadData);
                // setPublicChats([...publicChats]);
                setPublicChats(p=>[...p,payloadData])
                break;
        }
        console.log(publicChats);
    }


    const onPrivateMessage = (payload)=>{
        var payloadData = JSON.parse(payload.body);
        if(privateChats.get(payloadData.senderName)){
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        }else{
            let list =[];
            list.push(payloadData);
            privateChats.set(payloadData.senderName,list);
            setPrivateChats(new Map(privateChats));
        }
        console.log(privateChats);
    }

    

   
    


    const onError = (error)=>{
        console.log(error);
    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        setUserData({...userData,"message": value});
    }

    const sendPublicMessage=()=>{

        if(stompClient){
            const chatMessage ={
                senderName:userData.username,
                message : userData.message,
                status:"MESSAGE"
            }
            stompClient.send("/app/message",{},JSON.stringify(chatMessage))
            setUserData({...userData,"message":""})
        }
        console.log(publicChats);
        console.log(stompClient);
    }

    const sendPrivateMessage=()=>{

        if(stompClient){
            const chatMessage={
                senderName:userData.username,
                receiverName:tab,
                message:userData.message,
                status:"MESSAGE"
            }

            if(userData.username !==tab){
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            console.log(privateChats);

            stompClient.send("/app/private-message",{},JSON.stringify(chatMessage))
            setUserData({...userData,"message":""})
        }
    }

    const handleUsername=(event)=>{
        const {value} = event.target;
        setUserData({...userData,"username":value});
    }

    const registerUser= ()=>{
        setLoading(true);
        connect(); 
    }


    
  return (
    <>
    {
        userData.connected? (
    <div className='chatapp-container'>
      <div className="user-list">
        <div className="user-list-top">
            <div className="icon">{userData.username[0]?.toUpperCase()}</div>
            <div className="username">{userData.username}</div>
        </div>
        <div className='line'></div>
        <div className="user-list-bottom">
            <div className="eachUser" onClick={()=>setTab("CHATROOM")}>
                <div className="icon">C</div>
                <div  className="username">ChatRoom</div>
            </div>
            {[...privateChats.keys()].filter((name)=>{return name!==userData.username}).map((name,i)=>{
                return <div key={i}  onClick={()=>{setTab(name)}}>
                    <div className="eachUser"  >
                        <div className="icon">{name.toUpperCase()[0]}</div>
                        <div className="username">{name}</div>
                    </div>
                </div> 
            })}
        </div>
      </div>
      <div className="chat-area">
        <div className="user-list-top">
        <div className="icon">{tab[0].toUpperCase()}</div>
            <div className="username">{tab}</div>
        </div>
        <div className='line'></div>
        <div className="chat-window">
            {tab==="CHATROOM" && publicChats.map((chat,index)=>{
                return chat.senderName!==userData.username ? 
                <OtherMessage key={index} content={chat.message} isGroupM={true}  senderName={chat.senderName}/> 
                :<SelfMessage key={index} content={chat.message}/> 
            })}

            {tab!=="CHATROOM" && [...privateChats.get(tab)].map((chat,index)=>{
                return chat.senderName!==userData.username ? 
                <OtherMessage key={index} content={chat.message} isGroupM={false}  senderName={chat.senderName}/>
                 :<SelfMessage key={index} content={chat.message}/>                 
            })}
        </div>
        <div className="message-input">
            <input type="text" value={userData.message} placeholder='send message'onChange={handleMessage} ></input>
            {tab==="CHATROOM" ? 
            <button disabled={userData.message.length<=0 ? true : false} onClick={sendPublicMessage} >send</button>
             : <button disabled={userData.message.length<=0 ? true : false} onClick={sendPrivateMessage} >send</button>} 
        </div>
      </div>
    </div>  
        ):<Register registerUser={registerUser} handleUsername={handleUsername} loading={loading}/>
    }
    
    
    </>
    
  )
}

export default Chatapp
