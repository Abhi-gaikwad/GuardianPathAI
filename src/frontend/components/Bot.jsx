import React, { useState ,  useRef, useEffect  } from "react";
import axios from "axios";
import crimeData from "./crimeData.json";
import "./Bot.css";
import Icon from './assets/travelsafe_logo.png';


const TravelSafeBot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const chatBodyRef = useRef(null); // Reference for the chat body

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory]); // Trigger this effect whenever chatHistory updates

  const GEMINI_API_KEY = "AIzaSyDdifJhrztNdBYGKGWM1xDtQr3vP2GSTds"; // Replace with your API Key
  const OPENSTREETMAP_API = "https://nominatim.openstreetmap.org/search";

  // ✅ 1️⃣ Route Suggestion Using OpenStreetMap
  const getRouteSuggestion = async (query) => {
    const locations = query.replace("route to", "").trim().split(" to ");
    if (locations.length < 2) return "Please specify both source and destination.";

    try {
      const [sourceRes, destRes] = await Promise.all([
        axios.get(`${OPENSTREETMAP_API}?q=${locations[0]}&format=json`),
        axios.get(`${OPENSTREETMAP_API}?q=${locations[1]}&format=json`),
      ]);

      if (!sourceRes.data.length || !destRes.data.length) {
        return "Couldn't find locations. Please check your input.";
      }

      return `🛣️ Route from **${locations[0]}** to **${locations[1]}**: 
      [View on OpenStreetMap](https://www.openstreetmap.org/directions?from=${sourceRes.data[0].lat},${sourceRes.data[0].lon}&to=${destRes.data[0].lat},${destRes.data[0].lon})`;
    } catch (error) {
      return "⚠️ Error fetching route details.";
    }
  };

  // ✅ 2️⃣ Crime Data Lookup by City
  const getCrimeDetails = (query) => {
    const location = query.replace("crime in", "").trim();

    if (!location) return "Please specify a location to check crime details.";

    const crimes = crimeData.filter((data) => data.City.toLowerCase() === location.toLowerCase());

    if (!crimes.length) return `No crime data available for **${location}**.`;

    const crimeList = crimes
      .map(
        (crime) =>
          `🔹 **${crime["Crime Description"]}** | Crime Code: ${crime["Crime Code"]} | Weapon: ${crime["Weapon Used"]} | Case Closed: ${crime["Case Closed"]}`
      )
      .join("\n");

    return `🕵️‍♂️ **Crimes reported in ${location}:**\n${crimeList}`;
  };

  // ✅ 3️⃣ Get Crime Code for a Specific Crime Description
  const getCrimeCode = (query) => {
    const crimeType = query.replace("crime code for", "").trim().toUpperCase();

    const crime = crimeData.find((data) => data["Crime Description"].toUpperCase() === crimeType);

    if (!crime) return `No crime code found for **${crimeType}**.`;

    return `The crime code for **${crimeType}** is **${crime["Crime Code"]}**.`;
  };

  // ✅ 4️⃣ Gemini AI API Integration
  const getGeminiResponse = async (query) => {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `You are a tourist guide. Answer only location-related queries or crime rates or safe routes or short routes. Also dont add ** for bolding the text , halting my formatting . Give short response .  User query: "${query}"`,
                },
              ],
            },
          ],
        },
        { headers: { "Content-Type": "application/json" } }
      );

      return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure about that.";
    } catch (error) {
      return "⚠️ Error fetching AI response.";
    }
  };

  // ✅ 5️⃣ Handling User Query
  const handleUserQuery = async (message) => {
    if (!message || typeof message !== "string") return "Please enter a valid message.";

    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes("route to")) {
      return await getRouteSuggestion(lowerMsg);
    } else if (lowerMsg.includes("crime in")) {
      return getCrimeDetails(lowerMsg);
    } else if (lowerMsg.includes("crime code for")) {
      return getCrimeCode(lowerMsg);
    } else {
      return await getGeminiResponse(message);
    }
  };

  // ✅ 6️⃣ Generating Bot Response
  const generateBotResponse = async (history) => {
    const userMessage = history[history.length - 1]?.text;
    if (!userMessage) return;

    setLoading(true);
    const botMessage = await handleUserQuery(userMessage);
    setChatHistory((prevHistory) => [...prevHistory, { role: "bot", text: botMessage }]);
    setLoading(false);
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        <img
          src={require('./assets/chatbot_icon.png')}
          alt="Chatbot Icon"
          className="chatbot-icon"
        />
      </button>

      {isOpen && (
        <div className="chatbot-popup">
          <div className="chat-header">
            <img src={Icon} className="chat_bot_icon" alt="Chatbot Icon" />
            <h2>TravelSafe Chatbot is here to help you in your Journey !</h2>
            <button onClick={() => setIsOpen(false)} className="close-btn">×</button>
          </div>

          <div className="chat-body" ref={chatBodyRef}>
            {chatHistory.map((chat, index) => (
              <div key={index} className={`chat-message ${chat.role}`}>
                {chat.text}
              </div>
            ))}
            {loading && <div className="chat-message bot">Thinking...</div>}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Ask something..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  const userMessage = e.target.value.trim();
                  setChatHistory((prevHistory) => [...prevHistory, { role: "user", text: userMessage }]);
                  generateBotResponse([...chatHistory, { role: "user", text: userMessage }]);
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelSafeBot;

