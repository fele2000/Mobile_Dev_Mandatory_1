// Alle skærme henter og gemmer runder gennem denne fil, så de ikke ved hvor data ligger.
// Lige nu er det bare i hukommelsen indtil vi får Firestore sat op.
// Funktionerne er async ligesom Firebase-kald, så skærmene ikke skal ændres når vi skifter.
let rounds = [];

export async function getRounds() {
  return [...rounds];
}

export async function addRound(round) {
  const savedRound = { ...round, id: round.id || `${Date.now()}` };
  rounds = [...rounds, savedRound];
  return savedRound;
}
