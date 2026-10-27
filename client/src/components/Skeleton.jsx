// Shop — one product card placeholder
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="h-48 shimmer" />
    <div className="p-4 space-y-3">
      <div className="h-4 w-20 rounded-full shimmer" />
      <div className="h-5 w-3/4 rounded shimmer" />
      <div className="h-3 w-full rounded shimmer" />
      <div className="h-3 w-2/3 rounded shimmer" />
      <div className="flex items-center justify-between pt-2">
        <div className="h-6 w-16 rounded shimmer" />
        <div className="h-5 w-20 rounded-full shimmer" />
      </div>
    </div>
  </div>
)

// Tracker — whole page placeholder
export const TrackerSkeleton = () => (
  <div className="min-h-screen bg-pink-50 py-8 px-4">

    {/* Header */}
    <div className="flex flex-col items-center mb-8 gap-2">
      <div className="h-8 w-56 rounded shimmer" />
      <div className="h-4 w-44 rounded shimmer" />
    </div>

    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 mb-8">

      {/* Calendar */}
      <div className="lg:w-1/2 bg-white rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="h-7 w-7 rounded-lg shimmer" />
          <div className="h-4 w-32 rounded shimmer" />
          <div className="h-7 w-7 rounded-lg shimmer" />
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg shimmer" />
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="lg:w-1/2 flex flex-col gap-4">
        <div className="h-32 rounded-2xl shimmer" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 rounded-2xl shimmer" />
          <div className="h-24 rounded-2xl shimmer" />
        </div>
        <div className="h-28 rounded-2xl shimmer" />
        <div className="h-12 rounded-xl shimmer" />
      </div>
    </div>

    {/* Past logs */}
    <div className="max-w-5xl mx-auto">
      <div className="h-5 w-32 rounded shimmer mb-3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl shimmer" />
        ))}
      </div>
    </div>

  </div>
)
