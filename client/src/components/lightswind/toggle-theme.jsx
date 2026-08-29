import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { flushSync } from "react-dom";
import { cn } from "../lib/utils";

/**
 * High-performance, silky smooth Vector Morphing Sun ↔ Moon Icon
 * Slower, elegant, graceful transitions
 */
function AnimatedSunMoon({ isDark }) {
    return (
        <div className="relative w-5 h-5 flex items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                    <motion.svg
                        key="moon"
                        initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-[#E6E2D3]"
                    >
                        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="#E6E2D3" stroke="#E6E2D3" />
                    </motion.svg>
                ) : (
                    <motion.svg
                        key="sun"
                        initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: -45, scale: 0.8 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-[#DA9B42]"
                    >
                        <circle cx="12" cy="12" r="4" fill="#DA9B42" stroke="#DA9B42" />
                        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                    </motion.svg>
                )}
            </AnimatePresence>
        </div>
    );
}

export const ToggleTheme = ({
    className,
    duration = 650,
    animationType = "shrink-grow",
    onThemeChange,
    ...props
}) => {
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
    const buttonRef = useRef(null);

    useEffect(() => {
        const updateTheme = () => {
            const currentDark = document.documentElement.classList.contains("dark");
            setIsDark(currentDark);
        };

        updateTheme();

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    const toggleTheme = useCallback(async (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        if (!buttonRef.current) return;

        const nextTheme = !isDark;

        // Fallback for browsers without View Transition API support
        if (!document.startViewTransition) {
            setIsDark(nextTheme);
            if (nextTheme) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            localStorage.setItem("theme", nextTheme ? "dark" : "light");
            if (typeof onThemeChange === "function") {
                onThemeChange(nextTheme ? "dark" : "light");
            }
            return;
        }

        // Enable zero-lag transition lock
        document.documentElement.classList.add("vt-active");

        try {
            // Wait for the DOM update to complete within the View Transition
            const transition = document.startViewTransition(() => {
                flushSync(() => {
                    setIsDark(nextTheme);
                    if (nextTheme) {
                        document.documentElement.classList.add("dark");
                    } else {
                        document.documentElement.classList.remove("dark");
                    }
                    localStorage.setItem("theme", nextTheme ? "dark" : "light");
                    if (typeof onThemeChange === "function") {
                        onThemeChange(nextTheme ? "dark" : "light");
                    }
                });
            });

            await transition.ready;

            // Spatial animations calculations
            const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
            const x = left + width / 2;
            const y = top + height / 2;
            const maxRadius = Math.hypot(
                Math.max(left, window.innerWidth - left),
                Math.max(top, window.innerHeight - top)
            );
            const viewportWidth = window.innerWidth;

            let animPromise = null;

            switch (animationType) {
                case "shrink-grow":
                    const animNew = document.documentElement.animate(
                        [
                            { transform: "scale(0.96)", opacity: 0 },
                            { transform: "scale(1)", opacity: 1 },
                        ],
                        {
                            duration: duration,
                            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                            pseudoElement: "::view-transition-new(root)",
                            fill: "both"
                        }
                    );
                    const animOld = document.documentElement.animate(
                        [
                            { transform: "scale(1)", opacity: 1 },
                            { transform: "scale(1.04)", opacity: 0 },
                        ],
                        {
                            duration: duration,
                            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                            pseudoElement: "::view-transition-old(root)",
                            fill: "both"
                        }
                    );
                    animPromise = Promise.all([animNew.finished, animOld.finished]);
                    break;

                case "circle-spread":
                    const circAnim = document.documentElement.animate(
                        {
                            clipPath: [
                                `circle(0px at ${x}px ${y}px)`,
                                `circle(${maxRadius}px at ${x}px ${y}px)`,
                            ],
                        },
                        {
                            duration,
                            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                            pseudoElement: "::view-transition-new(root)",
                            fill: "both"
                        }
                    );
                    animPromise = circAnim.finished;
                    break;

                case "swipe-left":
                    const swipeLAnim = document.documentElement.animate(
                        {
                            clipPath: [
                                `inset(0 0 0 ${viewportWidth}px)`,
                                `inset(0 0 0 0)`,
                            ],
                        },
                        {
                            duration,
                            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                            pseudoElement: "::view-transition-new(root)",
                            fill: "both"
                        }
                    );
                    animPromise = swipeLAnim.finished;
                    break;

                case "fade-in-out":
                default:
                    const fadeAnim = document.documentElement.animate(
                        {
                            opacity: [0, 1],
                        },
                        {
                            duration: duration,
                            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                            pseudoElement: "::view-transition-new(root)",
                            fill: "both"
                        }
                    );
                    animPromise = fadeAnim.finished;
                    break;
            }

            if (animPromise) {
                await animPromise;
            }
            await transition.finished;

        } catch (err) {
            console.warn("View transition warning:", err);
        } finally {
            document.documentElement.classList.remove("vt-active");
        }

    }, [isDark, duration, animationType, onThemeChange]);

    return (
        <button
            ref={buttonRef}
            onClick={toggleTheme}
            type="button"
            className={cn(
                "w-9 h-9 p-0 rounded-full flex items-center justify-center cursor-pointer select-none overflow-hidden transition-all shrink-0",
                isDark 
                    ? "bg-[#161616] border border-[#262626] hover:border-amber-400/60 shadow-xs" 
                    : "bg-white border border-[#E8DFD5] hover:border-[#C85A32]/60 shadow-xs",
                className
            )}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
            {...props}
        >
            <div className="flex items-center justify-center pointer-events-none">
                <AnimatedSunMoon isDark={isDark} />
            </div>
        </button>
    );
};

export default ToggleTheme;
