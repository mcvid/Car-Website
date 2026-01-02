// chatbot.js
// UI Layer - Handles DOM, events, and calls BotEngine.

const flow = {
  start: {
    msg: "Hi! I'm Mcvid Bot 🤖. How can I help you today?",
    options: [
      { text: "🚗 Buy a Car", msg: "buy car" }, // Triggers 'buy_general' or broad intent
      { text: "💰 Sell my Car", msg: "sell my car" }, // Triggers 'sell_car'
      { text: "🔧 Support", msg: "help" }, // Triggers 'help_general'
    ],
  },
};

const initChat = () => {
  if (!document.querySelector(".chatbot")) {
    createChatHTML();
  }

  const toggler = document.querySelector(".chatbot-toggler");
  const closeBtn = document.querySelector(".chatbot-close");
  const sendBtn = document.querySelector("#send-btn");
  const chatInput = document.querySelector(".chat-input textarea");
  const chatbox = document.querySelector(".chatbox");

  if (toggler)
    toggler.addEventListener("click", () => {
      document.body.classList.toggle("show-chatbot");
      saveHistory();
    });
  if (closeBtn)
    closeBtn.addEventListener("click", () => {
      document.body.classList.remove("show-chatbot");
      saveHistory();
    });

  // Input Handling
  const handleChat = () => {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Clear & Append User Msg
    chatInput.value = "";
    chatInput.style.height = "auto";
    appendMessage(userMessage, "outgoing");

    // Process with Engine
    setTimeout(() => {
      showTyping();
      try {
        const response = botEngine.processMessage(userMessage);

        setTimeout(() => {
          hideTyping();
          appendMessage(response.text, "incoming");
          if (response.options) showOptions(response.options);

          if (response.effect) handleEffect(response.effect, response.entities);
          if (response.action) handleEffect(response.action, response.entities); // Legacy
        }, 600 + Math.random() * 500); // Random delay
      } catch (err) {
        console.error(err);
        hideTyping();
        appendMessage("⚠️ System Error: " + err.message, "incoming");
      }
    }, 100);
  };

  if (sendBtn) sendBtn.addEventListener("click", handleChat);
  if (chatInput) {
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
      }
    });
  }

  // Start conv handled by loadHistory
  // if (chatbox && chatbox.children.length === 0) { ... }
};

const createChatHTML = () => {
  const chatHTML = `
    <button class="chatbot-toggler">
      <img src="images/robot-icon.png" alt="Chat" />
      <span class="material-symbols-rounded">close</span>
    </button>
    <div class="chatbot">
      <header>
        <h2>Mcvid Assistant</h2>
        <span class="close-btn material-symbols-rounded chatbot-close">close</span>
      </header>
      <ul class="chatbox"></ul>
      <div class="chat-input">
        <textarea placeholder="Type a message..." spellcheck="false" required></textarea>
        <span id="send-btn" class="material-symbols-rounded">send</span>
      </div>
    </div>`;

  const div = document.createElement("div");
  div.innerHTML = chatHTML;
  document.body.appendChild(div.firstElementChild); // Toggler
  document.body.appendChild(div.lastElementChild); // Chatbot window
};

const showTyping = () => {
  const chatbox = document.querySelector(".chatbox");
  const li = document.createElement("li");
  li.classList.add("chat", "incoming", "typing-li");
  li.innerHTML = `<span class="material-symbols-rounded">smart_toy</span><div class="typing-indicator"><span></span><span></span><span></span></div>`;
  chatbox.appendChild(li);
  chatbox.scrollTo(0, chatbox.scrollHeight);
};

const hideTyping = () => {
  const li = document.querySelector(".typing-li");
  if (li) li.remove();
};

const handleEffect = (effect, entities) => {
  if (!effect) return;

  setTimeout(() => {
    // Current URL base
    let url = "catalog.html";
    const query = [];

    // Map legacy actions if they still exist (safety) behavior
    // But we prefer effect object: { type: 'filter', params: { type: 'suv' } }

    if (effect.type === "filter") {
      const params = effect.params || {};
      Object.keys(params).forEach((key) => {
        query.push(`${key}=${params[key]}`);
      });
      window.location.href = url + (query.length ? "?" + query.join("&") : "");
    } else if (effect.type === "sort") {
      window.location.href = `catalog.html?sort=${effect.params.sort}`;
    } else if (effect.type === "navigation") {
      window.location.href = effect.params.url;
    } else if (effect.type === "link") {
      window.open(effect.params.url, "_blank");
    }
    // Fallback for legacy string actions if any intent wasn't updated
    else if (typeof effect === "string") {
      console.warn("Legacy Action detected:", effect);
      // Map common ones or just ignore
      if (effect.includes("filter")) window.location.href = "catalog.html";
    }
  }, 1500);
};

const showOptions = (options) => {
  const chatbox = document.querySelector(".chatbox");
  const optsDiv = document.createElement("div");
  optsDiv.className = "chat-options";
  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "chat-btn";
    btn.textContent = opt.text;
    btn.onclick = () => {
      // Remove options after click for cleaner UI
      optsDiv.remove();

      // USER VISUAL: Show what they clicked as a message
      appendMessage(opt.text, "outgoing");

      // ENGINE LOGIC: Treat button click exactly like typing
      setTimeout(() => {
        showTyping();
        // Use the displayed text, or a specific msg/value if provided in option
        const inputToProcess = opt.msg || opt.text;

        // Process through the SINGLE brain
        const response = botEngine.processMessage(inputToProcess);

        setTimeout(() => {
          hideTyping();
          appendMessage(response.text, "incoming");

          if (response.options) showOptions(response.options);

          // Updated: Handle 'effect' instead of 'action'
          if (response.effect) handleEffect(response.effect, response.entities);
          // Legacy support if 'action' passes through
          if (response.action) handleEffect(response.action, response.entities);

          if (response.waitForUser) {
            // Maybe change input placeholder or focus?
            // For now standard flows works.
          }
        }, 800 + Math.random() * 500);
      }, 200);
    };
    optsDiv.appendChild(btn);
  });
  chatbox.appendChild(optsDiv);
  chatbox.scrollTo(0, chatbox.scrollHeight);
};

// Save/Load History
const saveHistory = () => {
  const chatbox = document.querySelector(".chatbox");
  if (!chatbox) return;
  const msgs = [];
  chatbox.querySelectorAll(".chat").forEach((li) => {
    const isOutgoing = li.classList.contains("outgoing");
    const text = li.querySelector("p").innerHTML; // Save HTML for formatting
    if (!li.classList.contains("typing-li")) {
      msgs.push({ isOutgoing, text });
    }
  });
  localStorage.setItem("botHistory", JSON.stringify(msgs));
  localStorage.setItem(
    "botState",
    document.body.classList.contains("show-chatbot") ? "open" : "closed"
  );
};

const loadHistory = () => {
  const saved = localStorage.getItem("botHistory");
  const state = localStorage.getItem("botState");
  if (state === "open") document.body.classList.add("show-chatbot");

  if (saved) {
    try {
      const msgs = JSON.parse(saved);
      const chatbox = document.querySelector(".chatbox");
      if (msgs.length > 0) {
        // Clear default start message if we have history, BUT wait for it to be added?
        // Actually, if we just append, it's fine.
        // Better: Clear chatbox first
        chatbox.innerHTML = "";
        msgs.forEach((m) =>
          appendMessage(m.text, m.isOutgoing ? "outgoing" : "incoming", true)
        ); // true = skip save
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    // Default Start if no history
    setTimeout(() => {
      appendMessage(flow.start.msg, "incoming");
      showOptions(flow.start.options);
    }, 500);
  }
};

// Global Init
document.addEventListener("DOMContentLoaded", () => {
  // 1. Inject CSS if missing
  if (!document.querySelector('link[href*="chatbot.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/chatbot.css";
    document.head.appendChild(link);
  }
  // 2. Load Material Symbols
  if (!document.querySelector('link[href*="material-symbols-rounded"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,1,0";
    document.head.appendChild(link);
  }

  initChat();

  // Load History after Init
  setTimeout(loadHistory, 100);
});

// Updated Append to Save
const appendMessage = (message, className, skipSave = false) => {
  const chatbox = document.querySelector(".chatbox");
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let content =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-rounded">smart_toy</span><p></p>`;
  chatLi.innerHTML = content;
  // Formatting
  const formatted = message.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  chatLi.querySelector("p").innerHTML = formatted;
  chatbox.appendChild(chatLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);

  if (!skipSave) saveHistory();
};

// Update Toggler to Save State
// (This needs to be inside initChat where toggler is selected,
// OR we delegate event listener to body if possible, but initChat adds it securely)
// We will update initChat to save state on toggle.
