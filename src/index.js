import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import io from 'socket.io-client';

import './index.css';

// const Message = ({ username, text }) => {
//     return (
//         <div className="message">
//             <p className="message-username">{username}</p>
//             <p className="message-text">{text}</p>
//         </div>
//     );
// };

const Message = ({ username, text }) => {
    return (
        <div className="other">
            <div className="msg">
                <div className="user">{username}</div>
                <p>{text}</p>
            </div>
        </div>
    );
};


const socket = io('http://43.204.114.140', { path: '/socket.io' });

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('');
    const [showJoinAlert, setShowJoinAlert] = useState(false);
    const [showMessageAlert, setShowMessageAlert] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const [currentView, setCurrentView] = useState('screen__content');

    const [messageData, setMessageData] = useState([]);

    useEffect(() => {
        // const handleIncomingMessage = (message) => {

        //     setMessageData(message);

        //     setMessages((prevMessages) => [...prevMessages, message]);

        // };

        // socket.on('message', handleIncomingMessage);

        const handleIncomingMessage = (message) => {

            setMessages((prevMessages) => [...prevMessages, message]);

        };

        socket.on('message', handleIncomingMessage);

        const handleIncomingMessage2 = (message) => {

            setMessageData(message);

        };

        socket.on('message2', handleIncomingMessage2);

        return () => {
            // Cleanup function to unsubscribe when the component unmounts
            socket.off('message', handleIncomingMessage);
        };
    }, [messages]);

    const joinRoom = () => {
        if (username.trim() !== '' && room.trim() !== '') {
            socket.emit('joinRoom', { username, room });
            setIsJoined(true);
            setShowJoinAlert(false);
            setCurrentView('messages'); // Switch to the messages view after joining
        } else {
            setShowJoinAlert(true);
        }
    };

    const sendMessage = () => {
        if (isJoined && room && messageText.trim() !== '') {
            socket.emit('sendMessage', { text: messageText });
            setMessageText('');
            setShowMessageAlert(false);
        } else {
            setShowMessageAlert(true);
        }
    };

    // Set body background color based on the current view
    useEffect(() => {
        const body = document.body;

        const container = document.querySelector('.container');

        const chat = document.querySelector('.chat');

        if (currentView === 'screen__content') {

            body.style.background = 'linear-gradient(90deg, #C7C5F4, #776BCC)';
            body.style.overflow = 'hidden';

            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';
            container.style.minHeight = '100vh';

            chat.style.boxShadow = '0px 0px 24px #5C5696';
            chat.style.height = '600px';
            chat.style.width = '360px';
            chat.style.position = 'relative';

        } else {

            body.style.background = '#252C33';
            body.style.overflow = 'auto';
            body.style.margin = '0px auto';
            // body.style.display = 'block';

            container.style.display = '';
            container.style.alignItems = '';
            container.style.justifyContent = '';
            container.style.minHeight = '';

            chat.style.listStyle = 'none';
            chat.style.background = 'none';
            chat.style.margin = '0';
            chat.style.padding = '0 0 50px 0';
            chat.style.marginTop = '60px';
            chat.style.marginBottom = '15px';

            chat.style.boxShadow = 'none';
            chat.style.height = '';
            chat.style.width = '';
            chat.style.position = '';

        }

        return () => {
            // Cleanup function to reset body background color when the component unmounts
            body.style.background = '';
        };
    }, [currentView]);

    return (
        <>
            <div className="chat">
                {!isJoined && (
                    <>
                        <div className="screen__content">

                            <div className="login">

                                <div className="login__field">
                                    <i className="login__icon fas fa-user"></i>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter your username..."
                                        className="login__input"
                                    />
                                </div>
                                <div className="login__field">
                                    <i className="login__icon fas fa-lock"></i>
                                    <input
                                        type="text"
                                        value={room}
                                        onChange={(e) => setRoom(e.target.value)}
                                        placeholder="Receiver Username"
                                        className="login__input"
                                    />
                                </div>
                                <button onClick={joinRoom} className="button login__submit" id="callApiButton">
                                    <span className="button__text">Join Room</span>
                                    <i className="button__icon fas fa-chevron-right"></i>
                                </button>
                            </div>

                            <div className="social-login">
                                <h3></h3>
                                <div className="social-icons">
                                    <a href="#" className="social-login__icon fab fa-instagram"></a>
                                    <a href="#" className="social-login__icon fab fa-facebook"></a>
                                    <a href="#" className="social-login__icon fab fa-twitter"></a>
                                </div>
                            </div>

                            {/* <button onClick={joinRoom}>Join Room</button> */}
                            {showJoinAlert && (
                                <div className="alert">Please provide valid username and room before joining.</div>
                            )}
                        </div>

                        <div className="screen__background">
                            <span className="screen__background__shape screen__background__shape4"></span>
                            <span className="screen__background__shape screen__background__shape3"></span>
                            <span className="screen__background__shape screen__background__shape2"></span>
                            <span className="screen__background__shape screen__background__shape1"></span>
                        </div>

                    </>
                )}
                {isJoined && (
                    <>

                        {messageData.map((message) => (
                            <div className="other">
                                <div key={message._id} className="msg">
                                    <div className="user">{message.Sender}</div>
                                    <p>{message.Message}</p>
                                </div>
                            </div>
                        ))}

                        {messages.map((message, index) => (
                            <Message key={index} username={message.username} text={message.text} />
                        ))}

                        {/* <div className="messages">
                            {messages.map((message, index) => (
                                <Message key={index} username={message.username} text={message.text} />
                            ))}
                        </div> */}

                        {/* <div className="other">
                            <div className="msg">
                                <div className="user">You</div>
                                <p>Hi</p>
                            </div>
                        </div>

                        <div className="self">
                            <div className="msg">
                                <p>Hey</p>
                            </div>
                        </div> */}

                        {/* <div className="typezone">
                    <form>
                        <textarea type="text" placeholder="Say something"></textarea>
                        <input type="submit" className="send" value="" />
                    </form>
                </div> */}
                        {/* <div className="messages">
                            {messages.map((message, index) => (
                                <Message key={index} username={message.username} text={message.text} />
                            ))}
                        </div> */}
                        <div className="input-box">
                            {/* <input
                                type="text"
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder="Type your message..."
                            /> */}
                            {/* <button onClick={sendMessage} disabled={!isJoined}>
                                Send
                            </button> */}
                            {/* {showMessageAlert && (
                                <div className="alert">Please enter a non-empty message before sending.</div>
                            )} */}
                        </div>
                    </>
                )}
            </div>
            {isJoined && (
                <>
                    <div className="typezone">
                        <form>
                            {/* <textarea type="text" placeholder="Say something"></textarea> */}
                            <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} className="send2" placeholder="Enter text..." />
                        </form>
                        <input type="submit" className="send" value="" onClick={sendMessage} disabled={!isJoined} />
                        {showMessageAlert && (
                            <div className="alert">Please enter a non-empty message before sending.</div>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Chat />
    </React.StrictMode>
);
