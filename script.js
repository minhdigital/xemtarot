let tarotData = [];

fetch('tarot.json')
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

  selectedCards.forEach((card, i) => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.innerHTML = `
      <h2>Card ${i + 1}: ${card.name} (${card.orientation})</h2>
      <img src="${card.image}" alt="${card.name}" />
      <p><strong>Ý nghĩa:</strong> ${card.meaning}</p>
    `;
    resultDiv.appendChild(cardDiv);
  });
}
