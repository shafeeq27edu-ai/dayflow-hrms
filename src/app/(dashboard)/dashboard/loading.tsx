export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-stack-lg animate-pulse w-full">
      <header className="mb-stack-lg">
        <div className="h-12 w-64 bg-surface-variant mb-2 rounded" />
        <div className="h-6 w-96 bg-surface-variant rounded" />
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface-container-lowest border border-primary p-stack-md flex flex-col gap-stack-sm h-32 rounded">
            <div className="h-4 w-24 bg-surface-variant rounded" />
            <div className="h-10 w-16 bg-surface-variant mt-2 rounded" />
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="lg:col-span-2 bg-surface-container-lowest border border-primary flex flex-col h-64 rounded">
          <div className="p-stack-md border-b border-primary">
            <div className="h-8 w-48 bg-surface-variant rounded" />
          </div>
          <div className="p-stack-md flex flex-col gap-4">
            <div className="h-8 w-full bg-surface-variant rounded" />
            <div className="h-8 w-full bg-surface-variant rounded" />
            <div className="h-8 w-full bg-surface-variant rounded" />
          </div>
        </div>
        
        <div className="bg-surface-container-lowest border border-primary flex flex-col h-64 rounded">
          <div className="p-stack-md border-b border-primary">
            <div className="h-8 w-40 bg-surface-variant rounded" />
          </div>
          <div className="p-stack-md flex flex-col gap-4">
            <div className="h-12 w-full bg-surface-variant rounded" />
            <div className="h-12 w-full bg-surface-variant rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
