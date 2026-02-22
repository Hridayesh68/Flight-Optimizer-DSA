import { Link } from 'react-router-dom';
import { IoAirplaneOutline, IoAnalyticsOutline, IoPlanetOutline } from 'react-icons/io5';

const Home = () => {
    return (
        <div className="flex flex-col min-h-[90vh]">
            <div className="flex-1 flex flex-col justify-center items-center text-center px-4 fade-in">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                    Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">Flight Route</span> Optimizer
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mb-12">
                    Optimize your travel routing using advanced graph algorithms. Compare real-time performance between Dijkstra and A*.
                </p>

                <Link to="/plan-flight" className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    Start Planning
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl w-full text-left">
                    <FeatureCard
                        icon={<IoAirplaneOutline />}
                        title="Smart Graph Routing"
                        description="Explore full adjacency-list based network graphs representing direct international flights."
                    />
                    <FeatureCard
                        icon={<IoAnalyticsOutline />}
                        title="Compare Algorithms"
                        description="See firsthand how Dijkstra solves networks compared to A* with Haversine Heuristic calculations."
                    />
                    <FeatureCard
                        icon={<IoPlanetOutline />}
                        title="Dynamic Target Weights"
                        description="Optimize your flights along minimum duration (hours), shortest distance (km), or cheapest pricing ($)."
                    />
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
        <div className="text-4xl text-blue-500 mb-4 bg-blue-50 p-4 rounded-full">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500">{description}</p>
    </div>
);

export default Home;
