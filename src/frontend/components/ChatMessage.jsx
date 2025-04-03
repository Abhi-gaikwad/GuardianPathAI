import React from "react";
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown
import ChatBotIcon from "./ChatBotIcon"; // Ensure this path is correct

const ChatMessage = ({ chat }) => {
  if (!chat) {
    return null; // Return null if chat is undefined
  }

  const { role, text } = chat;

  return (
    <div className={`message ${role === "bot" ? "bot-message" : "user-message"}`}>
      {role === "bot" && <ChatBotIcon />}
      {role === "bot" ? (
        //  className="message-text">{text}
        <ReactMarkdown className="message-text">{text}</ReactMarkdown> // Render bot messages as Markdown
      ) : (
        <p className="message-text">{text}</p> // Render user messages as plain text
      )}
    </div>
  );
};

export default ChatMessage;