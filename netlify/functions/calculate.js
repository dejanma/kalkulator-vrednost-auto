const deprecijacija = {
  1: 0.85, 2: 0.78, 3: 0.75, 4: 0.65, 5: 0.60,
  6: 0.55, 7: 0.52, 8: 0.46, 9: 0.40, 10: 0.35,
  11: 0.32, 12: 0.29, 13: 0.26, 14: 0.24, 15: 0.22,
  16: 0.20, 17: 0.18, 18: 0.16, 19: 0.14, 20: 0.12
};

const kmFaktori = [
  { max: 50000, faktor: 1.00 },
  { max: 100000, faktor: 0.97 },
  { max: 150000, faktor: 0.92 },
  { max: 200000, faktor: 0.85 },
  { max: 250000, faktor: 0.80 },
  { max: 400000, faktor: 0.65 }
];

exports.handler = async (event) => {
  try {
    const { novaCena, godine, kilometraza, servis, pogon } = JSON.parse(event.body);

    // VALIDACIJA
    if (novaCena < 1000) throw new Error('Cena mora biti veća od 1000€');
    if (!deprecijacija[godine]) throw new Error('Godine moraju biti između 1 i 20');
    if (!kmFaktori.find(f => f.max === kilometraza)) throw new Error('Nevalidan opseg kilometraže');

    const depFaktor = deprecijacija[godine];
    const kmFaktor = kmFaktori.find(f => f.max === kilometraza).faktor;  // ← TAJNO: koristi max kao ključ
    const servisFaktor = servis === 'Da' ? 1.0 : 0.9;
    const pogonFaktor = pogon === 'Da' ? 1.1 : 1.0;

    const vrednost = novaCena * depFaktor * kmFaktor * servisFaktor * pogonFaktor;
    const gubitak = novaCena - vrednost;

    return {
      statusCode: 200,
      body: JSON.stringify({ vrednost, gubitak })
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
};
