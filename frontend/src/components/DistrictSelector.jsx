export default function DistrictSelector({
                                             state,
                                             districts,
                                             selectedDistrict,
                                             onSelect,
                                             onLoadDistricts,
                                             loading
                                         }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Your District</h2>

            <button
                onClick={onLoadDistricts}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition"
            >
                {loading ? '⏳ Loading...' : `Load Districts - ${state}`}
            </button>

            {districts.length > 0 && (
                <select
                    onChange={(e) => onSelect(e.target.value)}
                    value={selectedDistrict}
                    disabled={loading}
                    className="w-full mt-4 p-3 border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">Choose a district...</option>
                    {districts.map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            )}
        </div>
    );
}
