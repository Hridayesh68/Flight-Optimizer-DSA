const AttractionFilter = ({ categoryFilter, setCategoryFilter, minRatingFilter, setMinRatingFilter }) => {
    const categories = ['All', 'Museum', 'Park', 'Temple', 'Fort', 'Beach', 'Lake', 'Landmark'];

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat === 'All' ? '' : cat)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${(categoryFilter === cat) || (cat === 'All' && !categoryFilter)
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="sm:w-48">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Rating</label>
                <select
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 p-2 border bg-gray-50"
                    value={minRatingFilter}
                    onChange={(e) => setMinRatingFilter(e.target.value)}
                >
                    <option value="">Any Rating</option>
                    <option value="3.5">3.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                </select>
            </div>
        </div>
    );
};

export default AttractionFilter;
