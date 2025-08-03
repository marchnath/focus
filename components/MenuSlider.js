"use client";

import {
  Cross1Icon,
  PersonIcon,
  GearIcon,
  ChatBubbleIcon,
  QuestionMarkCircledIcon,
  MoonIcon,
  SunIcon,
  ExitIcon,
} from "@radix-ui/react-icons";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function MenuSlider() {
  const { isMenuOpen, closeMenu, isDarkMode, toggleDarkMode } = useStore();
  const { signInWithGoogle, signOut } = useAuth();
  const { user, loading, displayName, avatar, email, isAuthenticated } =
    useUserProfile();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const menuItems = [
    { icon: GearIcon, label: "Upgrade to Plus", onClick: () => {} },
    { icon: ChatBubbleIcon, label: "Feedback", onClick: () => {} },
    { icon: QuestionMarkCircledIcon, label: "About", onClick: () => {} },
    {
      icon: isDarkMode ? SunIcon : MoonIcon,
      label: isDarkMode ? "Light Mode" : "Dark Mode",
      onClick: toggleDarkMode,
    },
  ];

  // Add logout button if user is authenticated
  if (isAuthenticated) {
    menuItems.push({
      icon: ExitIcon,
      label: "Sign Out",
      onClick: signOut,
    });
  }

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
          />
          <motion.div
            className="fixed left-0 top-0 h-full w-80 bg-white  shadow-xl z-50 flex flex-col"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="p-4 border-b border-[var(--gray)]">
              <button
                onClick={closeMenu}
                className="p-2 rounded-xl hover:bg-[var(--gray)] transition-colors ml-auto block"
              >
                <Cross1Icon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 space-y-4">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-[var(--gray)] transition-colors text-left"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-gray-900 ">{item.label}</span>
                </motion.button>
              ))}
            </div>

            <div className="p-4 border-t border-[var(--gray)]">
              {loading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-24"></div>
                    <div className="h-3 bg-gray-300 rounded animate-pulse w-32"></div>
                  </div>
                </div>
              ) : isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center overflow-hidden">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PersonIcon className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 ">
                      {displayName}
                    </p>
                    <p className="text-sm text-gray-600 ">{email}</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-[var(--primary)] text-white rounded-xl hover:bg-opacity-90 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
