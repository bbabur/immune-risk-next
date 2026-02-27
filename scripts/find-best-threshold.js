// Farklı threshold değerleri ile en iyi doğruluğu bul
const probs = [
  { id:1,  prob:0.008, expected:1 },
  { id:2,  prob:0.013, expected:1 },
  { id:3,  prob:0.970, expected:1 },
  { id:4,  prob:0.970, expected:1 },
  { id:5,  prob:0.639, expected:1 },
  { id:6,  prob:0.336, expected:1 },
  { id:7,  prob:0.352, expected:1 },
  { id:8,  prob:0.002, expected:0 },
  { id:9,  prob:0.043, expected:1 },
  { id:10, prob:0.991, expected:1 },
  { id:11, prob:0.100, expected:1 },
];

const thresholds = [0.01, 0.02, 0.03, 0.04, 0.05, 0.08, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.44, 0.50];

console.log('Threshold Analizi:');
console.log('─'.repeat(70));
console.log('Threshold | Doğru | Yanlış | Yanlış Hastalar');
console.log('─'.repeat(70));

for (const t of thresholds) {
  const results = probs.map(p => ({
    ...p,
    pred: p.prob >= t ? 1 : 0,
    correct: (p.prob >= t ? 1 : 0) === p.expected
  }));
  const correct = results.filter(r => r.correct).length;
  const wrong = results.filter(r => !r.correct).map(r => r.id);
  console.log(`  ${t.toFixed(2)}    |  ${correct}/11  |   ${11-correct}    | Hasta: ${wrong.join(', ') || '-'}`);
}
