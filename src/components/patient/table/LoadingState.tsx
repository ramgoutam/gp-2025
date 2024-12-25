export const LoadingState = () => {
  return (
    <div className="space-y-4 p-4 animate-fade-in">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}