import React, { useEffect, useState } from "react";
import "../App.css";
import ScrollToBottom from "react-scroll-to-bottom";

const Chats = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        id: new Date().getTime() ,
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessages((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container" >

        {messages.map((messageContent) => {
            return <div
            key={messageContent.id}
          className="message"
          id={username === messageContent.author ? "you" : "other"}
        >
          <div>
            <div className="message-content">
              <p>{messageContent.message}</p>
            </div>
            <div className="message-meta">
              <p id="time">{messageContent.time}</p>
              <p id="author">{messageContent.author}</p>
            </div>
          </div>
        </div>
        })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Hey..."
          value={currentMessage}
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chats;