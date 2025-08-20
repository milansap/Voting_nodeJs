import React, { useState } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isLoggedIn, isAdmin, removeToken } = useAuthStore() as {
    isLoggedIn: boolean
    isAdmin: boolean
    removeToken: () => void
  }
  const navigate = useNavigate()

  const handleLogout = () => {
    removeToken()

    setIsMobileMenuOpen(false)
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors duration-200"
            >
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xl cursor-pointer font-bold">VoteApp</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => handleNavigation('/')}
                    className="text-white cursor-pointer hover:text-black hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleNavigation('/vote')}
                    className="text-white cursor-pointer hover:text-black hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Vote
                  </button>
                  <button
                    onClick={() => handleNavigation('/results')}
                    className="text-white cursor-pointer hover:text-black hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Results
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleNavigation('/admin')}
                        className="text-yellow-300 cursor-pointer hover:text-black hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Admin Panel
                      </button>
                      <button
                        onClick={() => handleNavigation('/candidates')}
                        className="text-yellow-300 cursor-pointer hover:text-black hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Manage Candidates
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="text-white cursor-pointer hover:bg-white hover:text-black hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavigation('/register')}
                    className="bg-green-500 cursor-pointer hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-gray-200 focus:outline-none focus:text-gray-200 p-2"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black bg-opacity-20 rounded-lg mt-2">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => handleNavigation('/')}
                    className="text-white hover:bg-white hover:bg-opacity-20 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleNavigation('/vote')}
                    className="text-white hover:bg-white hover:bg-opacity-20 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200"
                  >
                    Vote
                  </button>
                  <button
                    onClick={() => handleNavigation('/results')}
                    className="text-white hover:bg-white hover:bg-opacity-20 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200"
                  >
                    Results
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleNavigation('/admin')}
                        className="text-yellow-300 hover:bg-white hover:bg-opacity-20 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200"
                      >
                        Admin Panel
                      </button>
                      <button
                        onClick={() => handleNavigation('/candidates')}
                        className="text-yellow-300 hover:bg-white hover:bg-opacity-20 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200"
                      >
                        Manage Candidates
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="text-white hover:bg-white hover:bg-opacity-20 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavigation('/register')}
                    className="bg-green-500 hover:bg-green-600 text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar