interface Props {
  score: number; // 0 a 100
}

export const JobMatchingScore = ({ score }: Props) => {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">Pontuação</span>
        <span className="text-sm font-medium text-gray-700">{score.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded h-3">
        <div
          className="bg-blue-600 h-3 rounded"
          style={{ width: `${score}%` }}
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>
    </div>
  );
};
