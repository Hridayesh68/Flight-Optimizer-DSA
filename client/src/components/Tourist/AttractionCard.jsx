import { IoLocationOutline, IoStar } from 'react-icons/io5';

const AttractionCard = ({ attraction }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full group">
            <div className="relative h-48 overflow-hidden bg-gray-200">
                <img
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&q=80' }}
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-bold flex items-center shadow-sm">
                    <IoStar className="text-yellow-500 mr-1" />
                    {attraction.rating}
                </div>
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {attraction.category}
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-1 text-gray-800 line-clamp-1" title={attraction.name}>{attraction.name}</h3>
                <p className="text-gray-500 text-sm mb-3 flex items-center">
                    <IoLocationOutline className="mr-1 text-green-600" /> {attraction.city}
                </p>

                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                    {attraction.description}
                </p>

                <button className="w-full py-2 bg-green-50 text-green-700 font-semibold rounded-lg border border-green-200 hover:bg-green-600 hover:text-white transition-colors duration-200 mt-auto">
                    View on Map
                </button>
            </div>
        </div>
    );
};

export default AttractionCard;
