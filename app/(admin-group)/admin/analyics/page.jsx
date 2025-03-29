export default function AnalyticsPage() {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Website Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Analytics charts would go here */}
          <div className="bg-gray-50 p-4 rounded-lg h-64 flex items-center justify-center">
            <p className="text-gray-500">Analytics Chart 1</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg h-64 flex items-center justify-center">
            <p className="text-gray-500">Analytics Chart 2</p>
          </div>
        </div>
      </div>
    );
  }