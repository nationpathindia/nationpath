export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-8 py-10 grid md:grid-cols-3 gap-8">
        
        <div>
          <h2 className="text-xl font-bold mb-4">NationPath</h2>
          <p className="text-gray-300">
            Delivering truth, insight, and perspective from around the world.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Follow Us</h3>
          <div className="space-y-2 text-gray-300">
            <div><a href="#">Facebook</a></div>
            <div><a href="#">Twitter</a></div>
            <div><a href="#">Instagram</a></div>
            <div><a href="#">YouTube</a></div>
          </div>
        </div>

      </div>

      <div className="bg-blue-950 text-center py-4 text-gray-400 text-sm">
        © {new Date().getFullYear()} NationPath. All rights reserved.
      </div>
    </footer>
  );
}