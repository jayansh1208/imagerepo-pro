import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Gallery from './pages/Gallery';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </main>
      <Toaster theme="dark" position="bottom-right" richColors />
    </div>
  );
}

export default App;
