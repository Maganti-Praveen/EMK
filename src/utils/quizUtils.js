export const QUIZ_PROGRESS_KEY = "emk.quiz.progress";
export const QUIZ_ROUND_DISTRIBUTION = {
  easy: 4,
  medium: 5,
  mixed: 2,
  hard: 4,
};

export const validateQuestion = (question) => {
  if (!question || typeof question !== "object") {
    return false;
  }

  const { id, text, options, correct } = question;

  return (
    Number.isInteger(id) &&
    typeof text === "string" &&
    text.trim().length > 0 &&
    Array.isArray(options) &&
    options.length >= 2 &&
    options.every((option) => typeof option === "string" && option.trim().length > 0) &&
    Number.isInteger(correct) &&
    correct >= 0 &&
    correct < options.length
  );
};

export const getPlayableQuestions = (questionBank = []) => {
  return questionBank.filter(validateQuestion);
};

export const shuffleQuestions = (questionBank = [], random = Math.random) => {
  const shuffled = [...questionBank];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

export const createQuestionSet = (questionBank = [], random = Math.random) => {
  const playable = getPlayableQuestions(questionBank);
  const grouped = {
    easy: [],
    medium: [],
    mixed: [],
    hard: [],
  };

  playable.forEach((question) => {
    const level = String(question.difficulty || "").toLowerCase();
    if (grouped[level]) {
      grouped[level].push(question);
    }
  });

  const pickRandom = (pool, count) => {
    return shuffleQuestions(pool, random).slice(0, count);
  };

  const easy = pickRandom(grouped.easy, QUIZ_ROUND_DISTRIBUTION.easy);
  const medium = pickRandom(grouped.medium, QUIZ_ROUND_DISTRIBUTION.medium);
  const mixed = pickRandom(grouped.mixed, QUIZ_ROUND_DISTRIBUTION.mixed);
  const hard = pickRandom(grouped.hard, QUIZ_ROUND_DISTRIBUTION.hard);

  const arranged = [...easy, ...medium, ...mixed, ...hard];
  const totalNeeded = Object.values(QUIZ_ROUND_DISTRIBUTION).reduce((sum, value) => sum + value, 0);

  if (arranged.length >= totalNeeded) {
    return arranged;
  }

  const selectedIds = new Set(arranged.map((question) => question.id));
  const fallbackPool = shuffleQuestions(playable.filter((question) => !selectedIds.has(question.id)), random);

  return [...arranged, ...fallbackPool].slice(0, totalNeeded);
};

export const getEarnedAmount = (prizeLevels, questionnumber) => {
  if (questionnumber <= 1) {
    return "₹ 0";
  }

  const previousLevel = prizeLevels.find((level) => level.id === questionnumber - 1);
  return previousLevel ? previousLevel.amount : "₹ 0";
};

export const resolveRound = ({ isCorrect, isTimeUp, currentQuestion, totalQuestions }) => {
  if (isTimeUp) {
    return { status: "timeout", nextQuestion: currentQuestion };
  }

  if (!isCorrect) {
    return { status: "wrong", nextQuestion: currentQuestion };
  }

  const nextQuestion = currentQuestion + 1;
  if (nextQuestion > totalQuestions) {
    return { status: "win", nextQuestion };
  }

  return { status: "continue", nextQuestion };
};

export const isValidStoredGameState = (state, maxQuestions) => {
  if (!state || typeof state !== "object") {
    return false;
  }

  const { roundQuestions, questionnumber, timeLeft, earned, gameover, hasWon } = state;

  if (!Array.isArray(roundQuestions) || roundQuestions.length === 0 || roundQuestions.length > maxQuestions) {
    return false;
  }

  if (!roundQuestions.every(validateQuestion)) {
    return false;
  }

  if (!Number.isInteger(questionnumber) || questionnumber < 1 || questionnumber > roundQuestions.length + 1) {
    return false;
  }

  if (typeof timeLeft !== "number" || timeLeft < 0 || timeLeft > 30) {
    return false;
  }

  if (typeof earned !== "string") {
    return false;
  }

  if (typeof gameover !== "boolean" || typeof hasWon !== "boolean") {
    return false;
  }

  return true;
};
