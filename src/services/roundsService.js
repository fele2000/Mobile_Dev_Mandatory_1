import mockRounds from '../data/mockRounds';

// Temporary session storage. Replace this module with Firestore and Storage later.
let rounds = [...mockRounds];

export async function getRounds() {
  return [...rounds];
}

export async function addRound(round) {
  const savedRound = {
    ...round,
    id: round.id || `${Date.now()}`,
  };

  rounds = [...rounds, savedRound];
  return savedRound;
}
