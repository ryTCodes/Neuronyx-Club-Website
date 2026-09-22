"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { usePathname, useRouter } from "next/navigation";

interface NavItem {
  name: string;
  to: string;
  description: string;
  shouldScroll: boolean;
  href?: string;
}

const navItems: NavItem[] = [
  {
    name: "Home",
    to: "hero",
    description: "Back to start",
    shouldScroll: true,
  },
  {
    name: "About",
    to: "about",
    description: "Know about us",
    shouldScroll: true,
  },
  {
    name: "Events",
    to: "events",
    description: "Our Events",
    shouldScroll: false,
    href: "/events",
  },
  {
    name: "Team",
    to: "teams",
    description: "Our Team",
    shouldScroll: false,
    href: "/teams",
  },
  {
    name: "FAQ",
    to: "faq",
    description: "Common questions",
    shouldScroll: true,
  },
  {
    name: "Contact",
    to: "contact",
    description: "Get in touch",
    shouldScroll: true,
  },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const location = { pathname: pathname || "/" };
  const navigate = (path: string) => {
    const target = path.startsWith("/") ? path : `/${path}`;
    router.push(target);
  };

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const navVariants: Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const handleNavigation = (path: string, shouldScroll: boolean) => {
    if (shouldScroll) {
      const targetId = path === "hero" ? "home" : path;
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const el =
            document.getElementById(targetId) ||
            document.getElementById(path);
          el?.scrollIntoView({
            behavior: "smooth",
          });
        }, 300);
      } else {
        const el =
          document.getElementById(targetId) ||
          document.getElementById(path);
        el?.scrollIntoView({
          behavior: "smooth",
        });
      }
    } else {
      const target = path.startsWith("/") ? path : `/${path}`;
      if (location.pathname === target) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate(target);
      }
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <div className="fixed w-full flex justify-center items-center z-50 px-3 sm:px-4 pointer-events-none">
        <motion.nav
          variants={navVariants}
          initial="hidden"
          animate="visible"
          className="pointer-events-auto px-5 py-2.5 sm:px-7 sm:py-3 w-[calc(100vw-1.5rem)] sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[42%] max-w-2xl mt-4 sm:mt-6 flex justify-between items-center backdrop-blur-2xl bg-black/40 rounded-full border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
        >
          {/* Brand */}
          <motion.div
            className="flex items-center shrink-0"
            whileHover={{ scale: 1.02 }}
          >
            <a
              href="/"
              className="text-base sm:text-lg md:text-xl font-semibold tracking-tight text-white"
            >
              NeurOnyx
            </a>
          </motion.div>

          {/* Menu Button Toggle (All screen sizes) */}
          <motion.button
            ref={menuButtonRef}
            onClick={toggleMenu}
            className="flex items-center justify-center p-2 rounded-full hover:bg-white/[0.08] transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <div className="flex flex-col gap-1.5 items-center justify-center w-5 h-5">
              <motion.span
                className="w-4 sm:w-5 h-0.5 bg-white rounded-full block origin-center"
                animate={isOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="w-4 sm:w-5 h-0.5 bg-white rounded-full block origin-center"
                animate={isOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </motion.button>
        </motion.nav>

        {/* Dropdown / Modal Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="pointer-events-auto fixed top-20 sm:top-24 w-[calc(100vw-1.5rem)] sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[42%] max-w-2xl max-h-[calc(100dvh-6rem)] overflow-y-auto backdrop-blur-3xl bg-[#0a0a0a]/95 rounded-3xl border border-white/[0.08] shadow-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] z-50 scrollbar-thin scrollbar-thumb-white/10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 p-4 sm:p-6">
                {navItems.map((item, index) => {
                  const isLastOdd =
                    index === navItems.length - 1 &&
                    navItems.length % 2 !== 0;

                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`group p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] transition-all duration-200 border border-transparent hover:border-white/[0.08] ${
                        isLastOdd ? "sm:col-span-2" : ""
                      }`}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                    >
                      {location.pathname === "/" && item.shouldScroll ? (
                        <ScrollLink
                          to={item.to}
                          smooth={true}
                          duration={500}
                          onClick={() => setIsOpen(false)}
                          className="cursor-pointer block"
                        >
                          <h3 className="text-base sm:text-lg font-medium text-white group-hover:text-cyan-300 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors mt-0.5">
                            {item.description}
                          </p>
                        </ScrollLink>
                      ) : (
                        <div
                          onClick={() =>
                            handleNavigation(
                              item.href || item.to,
                              item.shouldScroll
                            )
                          }
                          className="cursor-pointer block"
                        >
                          <h3 className="text-base sm:text-lg font-medium text-white group-hover:text-cyan-300 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-white/60 text-center">
                  © 2026 Neuronyx. All rights reserved.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Navbar;