import { io } from "socket.io-client";

// Connect to backend (Make sure backend is running on port 3000)
const socket = io("http://localhost:5000");

const statusEl = document.getElementById('status');
const messagesEl = document.getElementById('messages');
const joinBtn = document.getElementById('joinBtn');
const chatControls = document.getElementById('chatControls');
const myIdInput = document.getElementById('myId');
const receiverIdInput = document.getElementById('receiverId');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

socket.on('connect', () => {
    statusEl.innerText = "✅ Connected to Socket Server";
    statusEl.className = "status success";
});

socket.on('disconnect', () => {
    statusEl.innerText = "❌ Disconnected from Server";
    statusEl.className = "status error";
    chatControls.style.opacity = "0.5";
    chatControls.style.pointerEvents = "none";
});

// 1. JOIN (Reg as a user)
joinBtn.onclick = () => {
    const userId = myIdInput.value.trim();
    if (!userId) {
        alert("Enter your User ID first!");
        return;
    }
    
    socket.emit("join", userId);
    addLog(`System: You are online as [${userId}]`);
    
    chatControls.style.opacity = "1";
    chatControls.style.pointerEvents = "all";
    myIdInput.disabled = true;
    joinBtn.disabled = true;
    receiverIdInput.focus();
};

// 2. SEND PRIVATE MESSAGE
sendBtn.onclick = () => {
    const receiverId = receiverIdInput.value.trim();
    const message = messageInput.value.trim();
    if (!receiverId || !message) {
        alert("Enter Receiver ID and Message!");
        return;
    }

    const data = {
        senderId: myIdInput.value,
        receiverId: receiverId,
        message: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    socket.emit("send-message", data);
    addMessage(data, 'sent');
    messageInput.value = "";
    messageInput.focus();
};

// 3. LISTEN FOR PRIVATE MESSAGES
socket.on("receive-message", (data) => {
    console.log("New Private Message Received:", data);
    addMessage(data, 'received');
});

// Helper functions
function addMessage(data, type) {
    const div = document.createElement('div');
    div.className = `message ${type}`;
    const meta = type === 'sent' ? `To: ${data.receiverId}` : `From: ${data.senderId}`;
    div.innerHTML = `
        <div class="msg-meta">${meta} | ${data.timestamp}</div>
        <div>${data.message}</div>
    `;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addLog(text) {
    const div = document.createElement('div');
    div.className = 'log-entry';
    div.innerText = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

// ENTER key support
messageInput.onkeydown = (e) => { if (e.key === "Enter") sendBtn.click(); };
myIdInput.onkeydown = (e) => { if (e.key === "Enter") joinBtn.click(); };
