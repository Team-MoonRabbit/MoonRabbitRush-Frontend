export default function ProgressBar({ percentage }: { percentage: number }) {
  const blockCount = Number((percentage / 10).toFixed(0));
  const completeBlocks = "█".repeat(blockCount);
  const incompleteBlocks = "░".repeat(10 - blockCount);
  return (
    <div className="text-center">
      <p className="text-3xl text-yellow-500">
        {completeBlocks}
        {incompleteBlocks}
      </p>
      <p className="mt-2 text-white">{percentage}%</p>
    </div>
  );
}
