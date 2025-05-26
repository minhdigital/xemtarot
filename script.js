let tarotData = [];

fetch('tarot.json')
  .then(res => res.json())
  .then(data => {
  console.log("Groq response", data);
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error("Invalid AI response");
  }
  const reply = data.choices[0].message.content;
  });

function drawCards() {
  const question = document.getElementById('user-question').value;
  const resultDiv = document.getElementById('card-result');
  resultDiv.innerHTML = "";

  if (!question.trim()) {
    resultDiv.innerHTML = "<p>Vui lòng nhập câu hỏi trước khi rút bài.</p>";
    return;
  }

  const selectedCards = [];
  while (selectedCards.length < 3) {
    const randIndex = Math.floor(Math.random() * tarotData.length);
    const card = tarotData[randIndex];
    const isReversed = Math.random() > 0.5;

    selectedCards.push({
      ...card,
      orientation: isReversed ? "reversed" : "upright",
      meaning: isReversed ? card.reversed : card.upright
    });
  }

  // Hiển thị ảnh + tên + hướng lá bài trước
  selectedCards.forEach((card, i) => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.innerHTML = `
      <h2>Card ${i + 1}: ${card.name} (${card.orientation})</h2>
      <img src="${card.image}" alt="${card.name}" />
    `;
    resultDiv.appendChild(cardDiv);
  });

  const prompt = `Câu hỏi của tôi: ${question}\nTôi đã rút được 3 lá bài:\n1. ${selectedCards[0].name} (${selectedCards[0].orientation})\n2. ${selectedCards[1].name} (${selectedCards[1].orientation})\n3. ${selectedCards[2].name} (${selectedCards[2].orientation})\n\nHãy giải nghĩa ý nghĩa của 3 lá bài này theo ngữ cảnh câu hỏi.`;

  fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer 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',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "gemma-7b-it",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    })
  })
  .then(res => res.json())
  .then(data => {
    const reply = data.choices[0].message.content;
    const aiDiv = document.createElement('div');
    aiDiv.className = 'card';
    aiDiv.innerHTML = `<h2>Kết quả giải bài Tarot:</h2><p>${reply}</p>`;
    resultDiv.appendChild(aiDiv);
  })
  .catch(error => {
    console.error("Lỗi khi gọi Groq API:", error);
    resultDiv.innerHTML += "<p>Đã xảy ra lỗi khi gọi AI. Vui lòng thử lại sau.</p>";
  });
}
