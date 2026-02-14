async function summarizeChat(conversationText) {
  const res = await fetch("http://localhost:8000/summarize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      conversation: conversationText,
    }),
  });

  const data = await res.json();
  return data.summary;
}