export const formatStroop = (stroop: bigint): string => {
  return (Number(stroop) / 10_000_000).toFixed(7);
};
