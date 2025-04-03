import React, { useState } from "react";
import Card from "./Card";
import Bot from "./Bot";
import "./Bot.css"; // Ensure the correct path to Bot.css

const Chatbot = ({ open }) => {
  return (
    <>
      <Bot open={open} />
    </>
  );
};

export default Chatbot;