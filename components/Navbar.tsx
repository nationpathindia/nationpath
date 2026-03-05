import Image from "next/image";

export default function Navbar() {
  return (
    <header className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Image
            src="/logo.jpeg"
            alt="NationPath India"
            width={45}
            height={45}
          />
          <div>
            <h1 className="text-xl font-bold text-[#1E2A47]">
              NATIONPATH
            </h1>
            <p className="text-xs text-[#F7941D] tracking-widest">
              INDIA
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8 text-sm font-semibold text-gray-700">
          <a href="#" className="hover:text-[#F7941D]">Home</a>
          <a href="#" className="hover:text-[#F7941D]">Politics</a>
          <a href="#" className="hover:text-[#F7941D]">Markets</a>
          <a href="#" className="hover:text-[#F7941D]">MCX</a>
          <a href="#" className="hover:text-[#F7941D]">Global</a>
          <a href="#" className="hover:text-[#F7941D]">Technology</a>
        </nav>

        {/* Actions */}
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-[#1E2A47] text-[#1E2A47] rounded-md hover:bg-[#1E2A47] hover:text-white transition">
            Login
          </button>
          <button className="px-4 py-2 bg-[#F7941D] text-white rounded-md hover:opacity-90 transition">
            Subscribe
          </button>
        </div>

      </div>
    </header>
  );
}