// src/components/ProductSkeleton.jsx
export default function ProductSkeleton({ viewMode = 'grid' }) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
        <div className="flex gap-6 p-6">
          {/* Image Skeleton */}
          <div className="flex-shrink-0 w-64 h-64 bg-gray-200 rounded-xl" />
          
          {/* Content Skeleton */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Category & Stock */}
              <div className="flex gap-2">
                <div className="w-20 h-6 bg-gray-200 rounded-lg" />
                <div className="w-24 h-6 bg-gray-200 rounded-lg" />
              </div>
              
              {/* Title */}
              <div className="space-y-2">
                <div className="w-3/4 h-8 bg-gray-200 rounded" />
                <div className="w-1/2 h-8 bg-gray-200 rounded" />
              </div>
              
              {/* Rating */}
              <div className="flex gap-2">
                <div className="w-32 h-5 bg-gray-200 rounded" />
                <div className="w-16 h-5 bg-gray-200 rounded" />
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <div className="w-full h-4 bg-gray-200 rounded" />
                <div className="w-full h-4 bg-gray-200 rounded" />
                <div className="w-3/4 h-4 bg-gray-200 rounded" />
              </div>
            </div>
            
            {/* Price & Actions */}
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <div className="w-32 h-10 bg-gray-200 rounded" />
                <div className="w-24 h-6 bg-gray-200 rounded" />
              </div>
              <div className="flex gap-2">
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="w-40 h-12 bg-gray-200 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Skeleton
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      {/* Image Skeleton */}
      <div className="h-72 bg-gray-200" />
      
      {/* Content Skeleton */}
      <div className="p-5 space-y-4">
        {/* Category */}
        <div className="w-20 h-6 bg-gray-200 rounded-lg" />
        
        {/* Title */}
        <div className="space-y-2">
          <div className="w-full h-6 bg-gray-200 rounded" />
          <div className="w-3/4 h-6 bg-gray-200 rounded" />
        </div>
        
        {/* Rating */}
        <div className="flex gap-2">
          <div className="w-28 h-5 bg-gray-200 rounded" />
          <div className="w-12 h-5 bg-gray-200 rounded" />
        </div>
        
        {/* Price */}
        <div className="flex justify-between items-center">
          <div className="w-32 h-8 bg-gray-200 rounded" />
          <div className="w-20 h-6 bg-gray-200 rounded-lg" />
        </div>
        
        {/* Button */}
        <div className="w-full h-14 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}