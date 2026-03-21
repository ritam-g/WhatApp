// temporary DB
let messages = [];

export const sendMessage = (req, res) => {
  const { senderId, receiverId, message } = req.body;

  if (!senderId || !receiverId || !message) {
    return res.status(400).json({ message: "All fields required" });
  }

  const newMessage = {
    senderId,
    receiverId,
    message,
    time: new Date(),
  };

  messages.push(newMessage);

  res.json({
    success: true,
    data: newMessage,
  });
};

export const getMessages = (req, res) => {
  res.json({
    success: true,
    data: messages,
  });
};