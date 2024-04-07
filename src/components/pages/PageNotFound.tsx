import { Link } from "react-router-dom";

export default function PageNotFound() {
    return (
        <div className="flex flex-col bg-gray-50 items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
            <p className="text-gray-600">Sorry, the page you're looking for doesn't exist.</p>

            <div className="mt-6">
                <input
                    type="text"
                    placeholder="Search for content..."
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
            </div>

            <div className="mt-4 text-center">
                <p className="text-gray-600 mb-3">Or, you might want to explore:</p>
                <div className="flex flex-col">
                    <Link to="/me" className="text-blue-500 hover:underline">My Profile</Link>
                </div>
            </div>
        </div>
    )
}
