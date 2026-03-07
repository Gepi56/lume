export type AccountStatusMock = {
  reputationScore: number;
  reputationLevel: string;
  isVerified: boolean;
  isElite: boolean;
  nextGoalLabel: string;
  nextGoalValue: string;
};

export const accountStatusMock: AccountStatusMock = {
  reputationScore: 86,
  reputationLevel: "Molto alta",
  isVerified: true,
  isElite: false,
  nextGoalLabel: "Soglia Elite 90+",
  nextGoalValue: "+4 punti",
};
