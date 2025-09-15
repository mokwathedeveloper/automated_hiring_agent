import Link from 'next/link';
import { FaCheckCircle, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa'; // Import icons

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="group flex items-center space-x-2 mb-4 hover:scale-105 transition-all duration-200 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:scale-110 transition-all duration-200">
                <FaCheckCircle className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-200" />
              </div>
              <span className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors duration-200">HiringAgent</span>
            </div>
            <p className="text-gray-400 max-w-md">
              AI-powered recruitment solutions designed specifically for the Nigerian job market. 
              Streamline your hiring process with intelligent resume analysis.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="group text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1 flex items-center">Home</Link></li>
              <li><Link href="/dashboard" className="group text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1 flex items-center">Dashboard</Link></li>
              <li><Link href="/pricing" className="group text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1 flex items-center">Pricing</Link></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="group text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1 flex items-center">Privacy Policy</Link></li>
              <li><Link href="/terms" className="group text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1 flex items-center">Terms of Service</Link></li>
              <li><Link href="/contact" className="group text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1 flex items-center">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 HiringAgent. Built with ❤️ for the Nigerian tech ecosystem.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="group text-gray-400 hover:text-white transition-all duration-200 hover:scale-125 hover:-translate-y-1">
              <FaFacebook className="w-5 h-5 group-hover:text-blue-500 transition-colors duration-200" />
            </a>
            <a href="#" className="group text-gray-400 hover:text-white transition-all duration-200 hover:scale-125 hover:-translate-y-1">
              <FaTwitter className="w-5 h-5 group-hover:text-blue-400 transition-colors duration-200" />
            </a>
            <a href="#" className="group text-gray-400 hover:text-white transition-all duration-200 hover:scale-125 hover:-translate-y-1">
              <FaLinkedin className="w-5 h-5 group-hover:text-blue-600 transition-colors duration-200" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}