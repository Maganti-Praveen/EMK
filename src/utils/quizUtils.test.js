import { describe, expect, it } from "vitest";
import {
  createQuestionSet,
  getEarnedAmount,
  getPlayableQuestions,
  QUIZ_ROUND_DISTRIBUTION,
  resolveRound,
  validateQuestion,
} from "./quizUtils";

const sampleQuestions = [
  {
    id: 1,
    text: "Q1",
    options: ["A", "B", "C", "D"],
    correct: 1,
  },
  {
    id: 2,
    text: "Q2",
    options: ["A", "B", "C", "D"],
    correct: 2,
  },
  {
    id: 3,
    text: "Q3",
    options: ["A", "B", "C", "D"],
    correct: 3,
  },
];

describe("quiz question validation", () => {
  it("accepts a valid question", () => {
    expect(validateQuestion(sampleQuestions[0])).toBe(true);
  });

  it("rejects invalid question objects", () => {
    expect(
      validateQuestion({ id: 1, text: "Bad", options: ["A"], correct: 3 }),
    ).toBe(false);
  });

  it("filters out invalid questions", () => {
    const input = [...sampleQuestions, { id: 9, text: "", options: ["A"], correct: 0 }];
    expect(getPlayableQuestions(input)).toHaveLength(3);
  });
});

describe("question order randomization", () => {
  it("creates a question set with same ids in shuffled order", () => {
    const randomValues = [0.1, 0.8, 0.2, 0.7];
    let index = 0;
    const deterministicRandom = () => {
      const value = randomValues[index % randomValues.length];
      index += 1;
      return value;
    };

    const shuffled = createQuestionSet(
      [
        ...Array.from({ length: 6 }, (_, i) => ({
          id: i + 1,
          difficulty: "easy",
          text: `E${i + 1}`,
          options: ["A", "B", "C", "D"],
          correct: 0,
        })),
        ...Array.from({ length: 7 }, (_, i) => ({
          id: 100 + i,
          difficulty: "medium",
          text: `M${i + 1}`,
          options: ["A", "B", "C", "D"],
          correct: 1,
        })),
        ...Array.from({ length: 4 }, (_, i) => ({
          id: 200 + i,
          difficulty: "mixed",
          text: `X${i + 1}`,
          options: ["A", "B", "C", "D"],
          correct: 2,
        })),
        ...Array.from({ length: 8 }, (_, i) => ({
          id: 300 + i,
          difficulty: "hard",
          text: `H${i + 1}`,
          options: ["A", "B", "C", "D"],
          correct: 3,
        })),
      ],
      deterministicRandom,
    );

    const difficultyCounts = shuffled.reduce(
      (acc, question) => {
        acc[question.difficulty] += 1;
        return acc;
      },
      { easy: 0, medium: 0, mixed: 0, hard: 0 },
    );

    expect(shuffled).toHaveLength(15);
    expect(difficultyCounts.easy).toBe(QUIZ_ROUND_DISTRIBUTION.easy);
    expect(difficultyCounts.medium).toBe(QUIZ_ROUND_DISTRIBUTION.medium);
    expect(difficultyCounts.mixed).toBe(QUIZ_ROUND_DISTRIBUTION.mixed);
    expect(difficultyCounts.hard).toBe(QUIZ_ROUND_DISTRIBUTION.hard);
  });
});

describe("round outcomes", () => {
  it("continues on correct non-final answer", () => {
    const outcome = resolveRound({
      isCorrect: true,
      isTimeUp: false,
      currentQuestion: 2,
      totalQuestions: 5,
    });

    expect(outcome).toEqual({ status: "continue", nextQuestion: 3 });
  });

  it("ends with wrong on incorrect answer", () => {
    const outcome = resolveRound({
      isCorrect: false,
      isTimeUp: false,
      currentQuestion: 2,
      totalQuestions: 5,
    });

    expect(outcome).toEqual({ status: "wrong", nextQuestion: 2 });
  });

  it("ends with timeout when time is up", () => {
    const outcome = resolveRound({
      isCorrect: true,
      isTimeUp: true,
      currentQuestion: 4,
      totalQuestions: 5,
    });

    expect(outcome).toEqual({ status: "timeout", nextQuestion: 4 });
  });

  it("returns win on last correct answer", () => {
    const outcome = resolveRound({
      isCorrect: true,
      isTimeUp: false,
      currentQuestion: 5,
      totalQuestions: 5,
    });

    expect(outcome).toEqual({ status: "win", nextQuestion: 6 });
  });
});

describe("earned amount", () => {
  const prizeLevels = [
    { id: 1, amount: "₹ 100" },
    { id: 2, amount: "₹ 200" },
    { id: 3, amount: "₹ 300" },
  ];

  it("returns zero for first question", () => {
    expect(getEarnedAmount(prizeLevels, 1)).toBe("₹ 0");
  });

  it("returns previous level for progressing question", () => {
    expect(getEarnedAmount(prizeLevels, 3)).toBe("₹ 200");
  });
});
