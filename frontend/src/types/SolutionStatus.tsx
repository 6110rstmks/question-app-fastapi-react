// export enum SolutionStatus {
//     OnHold = 10,
//     Incorrect = 0,
//     Temporary = 1,
//     Correct = 2,
//     Perfect = 3
// }

export const SolutionStatus = {
    OnHold: 10,
    Incorrect: 0,
    Temporary: 1,
    Correct: 2,
    Perfect: 3
} as const

export type SolutionStatus = typeof SolutionStatus[keyof typeof SolutionStatus];

export type SolutionStatusMap = typeof SolutionStatus;

export const SolutionStatusReverse = Object.fromEntries(
  Object.entries(SolutionStatus).map(([k, v]) => [v, k])
) as Record<SolutionStatus, keyof typeof SolutionStatus>;