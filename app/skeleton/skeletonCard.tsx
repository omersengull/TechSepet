
export const SkeletonCard = () => {
  return (
    <div className="animate-pulse flex flex-col items-start gap-2 p-4 bg-gray-200 rounded-lg shadow-md">
      <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
      <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
      <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
      <div className="h-6 w-full bg-gray-300 rounded mt-2"></div>
    </div>
  )
}
