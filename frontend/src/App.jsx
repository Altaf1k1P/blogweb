import Footer from './components/Footer/Footer.jsx';
import Header from './components/header/Header.jsx';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header Section */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 min-w-full">
        <Outlet />
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}

export default App;
