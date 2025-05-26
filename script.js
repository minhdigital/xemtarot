let tarotData = [];

fetch('data/tarot.json')
  .then(res => res.json())
  .then(data => {
    tarotData = data;
  });

function drawCards() {
  const question = document.getElementById('user-question').value;
  const resultDiv = document.getElementById('card-result');
  resultDiv.innerHTML = "";

  if (!question.trim()) {
    resultDiv.innerHTML = "<p>Vui lòng nhập câu hỏi trước khi rút bài.</p>";
    return;
  }

  if (tarotData.length === 0) {
    resultDiv.innerHTML = "<p>Dữ liệu bài Tarot chưa sẵn sàng. Vui lòng thử lại sau.</p>";
    return;
  }

  const selectedCards = [];
  while (selectedCards.length < 3) {
    const randIndex = Math.floor(Math.random() * tarotData.length);
    const card = tarotData[randIndex];
    if (!card || !card.upright || !card.reversed) continue;

    const isReversed = Math.random() > 0.5;

    selectedCards.push({
      ...card,
      orientation: isReversed ? "reversed" : "upright",
      meaning: isReversed ? card.reversed : card.upright
    });
  }

  // Hiển thị bài
  selectedCards.forEach((card, i) => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.innerHTML = `
      <h2>Card ${i + 1}: ${card.name} (${card.orientation})</h2>
      <img src="${card.image}" alt="${card.name}" />
    `;
    resultDiv.appendChild(cardDiv);
  });

  const prompt = `Câu hỏi: ${question}\nTôi đã rút được 3 lá bài:\n1. ${selectedCards[0].name} (${selectedCards[0].orientation})\n2. ${selectedCards[1].name} (${selectedCards[1].orientation})\n3. ${selectedCards[2].name} (${selectedCards[2].orientation})\n\nHãy giải nghĩa 3 lá bài này theo ngữ cảnh câu hỏi trên.`;

  fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json",
      "HTTP-Referer": "https://minhdigital.github.io",
      "X-Title": "Xem Tarot"
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        {
          role: "user",
          content: prompt.trim()
        }
      ]
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log("AI response:", data);
      if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error("Không nhận được phản hồi hợp lệ từ OpenRouter.");
      }
      const reply = data.choices[0].message.content;
      const aiDiv = document.createElement('div');
      aiDiv.className = 'card';
      aiDiv.innerHTML = `<h2>Giải Nghĩa:</h2><p>${reply}</p>`;
      resultDiv.appendChild(aiDiv);
    })
    .catch(err => {
      console.error("Lỗi OpenRouter:", err);
      resultDiv.innerHTML += "<p>Không thể kết nối AI. Vui lòng thử lại sau.</p>";
    });
}
