
import Navbar from '../components/Navbar';

export default function TestScrollNavbar() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <Navbar />
      <div className="h-[200vh] p-8">
        <h1 className="text-4xl font-bold mb-4">Scroll Down to See Navbar Change!</h1>
        <p className="text-lg">This is some placeholder content to make the page scrollable. Keep scrolling to observe the navbar transition from transparent to green.</p>
        <p className="mt-4 text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p className="mt-4 text-lg">Curabitur pretium tincidunt lacus, eget gravida lectus. Vivamus vel enim at magna vulputate laoreet. Proin vel magna a turpis laoreet ultrices. Sed at ipsum nec felis luctus vestibulum. Donec nec justo nec nulla facilisis consectetur. Nam nec felis at libero facilisis rhoncus. Aliquam erat volutpat.</p>
        <p className="mt-4 text-lg">Phasellus nec mi sit amet mauris congue eleifend. Suspendisse potenti. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at elementum consequat.</p>
        <p className="mt-4 text-lg">Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetur vehicula. Nulla facilisi. Sed sit amet magna eu erat gravida semper.</p>
      </div>
    </div>
  );
}
