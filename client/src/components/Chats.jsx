import React, { useEffect, useState } from "react";
import notification from "../assets/notification.mp3"
import ScrollToBottom from "react-scroll-to-bottom";
import "../App.css";

const Chats = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const play = () => {
    new Audio(notification).play()
  }

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        id: new Date().getTime(),
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
      console.log(data);
      if (data.author !== username) {
        setMessages((list) => [...list, data]);
        play()
      }
    });
  }, [socket, username]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messages.map((messageContent) => (
            <div
              key={messageContent.id}
              className="message"
              id={username !== messageContent.author ? "other" : "you"}
            >
              <div>
                <div className="message-content">
                  <p className="px-1.5">{messageContent.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{messageContent.time}</p>
                  <p id="author">{messageContent.author}</p>
                </div>
              </div>
            </div>
          ))}
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
