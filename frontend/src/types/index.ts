export interface Campaign {
  id: string;
  name: string;
  description: string;
  goal: bigint;
  raised: bigint;
  deadline: bigint;
  owner: string;
}
