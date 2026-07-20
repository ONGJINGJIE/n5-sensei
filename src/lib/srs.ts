export type Rating = "again" | "hard" | "good" | "easy";

export interface CardState {
  interval: number;
  easeFactor: number;
  repetitions: number;
  dueDate: string;
  lastReviewed: string | null;
}

// SM-2 quality scale (0-5); anything below 3 counts as a lapse.
const QUALITY: Record<Rating, number> = { again: 0, hard: 2, good: 4, easy: 5 };

export function newCardState(): CardState {
  return {
    interval: 0,
    easeFactor: 2.5,
    repetitions: 0,
    dueDate: new Date(0).toISOString(),
    lastReviewed: null,
  };
}

export function isDue(card: CardState, now: Date = new Date()): boolean {
  return new Date(card.dueDate).getTime() <= now.getTime();
}

export function review(card: CardState, rating: Rating, now: Date = new Date()): CardState {
  const quality = QUALITY[rating];
  let { interval, repetitions } = card;
  let { easeFactor } = card;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  }

  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + interval);

  return {
    interval,
    easeFactor,
    repetitions,
    dueDate: dueDate.toISOString(),
    lastReviewed: now.toISOString(),
  };
}
