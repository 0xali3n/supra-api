import { useState } from "react";
import { Menu, X } from "lucide-react";
import { 
  SignInButton, 
  SignUpButton, 
  UserButton, 
  useUser 
} from "@clerk/clerk-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <img src="./sf.png" alt="SupraScan" className="w-8 h-8" />
              <span className="text-xl font-bold text-gray-900">
                SupraScan.fun
              </span>
            </a>
          </div>

          {/* Sign Up, Sign In, and User Profile */}
          <div className="flex items-center space-x-4">
            {!isSignedIn ? (
              <>
                <SignUpButton mode="modal">
                  <button className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">
                    Sign Up
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md">
                    Sign In
                  </button>
                </SignInButton>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  {user.firstName || user.username}
                </span>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`sm:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
          <div className="pt-2 pb-3 space-y-1">
            {/* Mobile menu items */}
            {isSignedIn && (
              <div className="px-4 py-2">
                <span className="text-gray-700">
                  {user.firstName || user.username}
                </span>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
