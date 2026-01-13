import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [gigs, setGigs] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchGigs();
    }, []);

    const fetchGigs = async (query = '') => {
        try {
            const { data } = await axios.get(`/api/gigs?search=${query}`);
            setGigs(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchGigs(search);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Find the perfect freelance gig</h1>
                <form onSubmit={handleSearch} className="flex justify-center gap-2 max-w-2xl mx-auto">
                    <input
                        type="text"
                        placeholder="Search for jobs by title..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                        Search
                    </button>
                </form>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {gigs.map((gig) => (
                    <div key={gig._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border border-gray-100 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900">{gig.title}</h3>
                            <p className="text-gray-500 text-sm mb-2">Posted by {gig.ownerId?.name || 'Unknown'}</p>
                            <p className="text-gray-600 mb-4 line-clamp-3">{gig.description}</p>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-green-600 font-bold text-lg">${gig.budget}</span>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${gig.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {gig.status.toUpperCase()}
                                </span>
                            </div>
                            <Link to={`/gigs/${gig._id}`} className="block w-full text-center bg-indigo-50 text-indigo-700 py-2 rounded-lg font-medium hover:bg-indigo-100 transition">
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
                {gigs.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 mt-10">
                        No gigs found. Be the first to post one!
                    </div>
                )}
            </div>
        </div>
    );
};
export default Home;
