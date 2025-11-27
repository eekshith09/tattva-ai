
import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { UserRole, ToolType } from "../types";
import type { UserProfile, HistoryItem } from "../types";


// ⭐ Local Badge type
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requiredXp: number;
}

interface AppContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  theme: "light" | "dark";
  history: HistoryItem[];
  badges: Badge[];
  login: (email: string) => void;
  logout: () => void;
  toggleTheme: () => void;
  addHistoryItem: (item: Omit<HistoryItem, "id" | "timestamp">) => void;
  earnCoins: (amount: number) => void;
  showToast: (message: string, type?: "success" | "error") => void;
  toast: { message: string; type: "success" | "error" } | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ⭐ Badge seeds
const INITIAL_BADGES: Badge[] = [
  { id: "1", name: "Novice", description: "Complete your first task", icon: "Award", unlocked: true, requiredXp: 0 },
  { id: "2", name: "Specialist", description: "Earn 500 XP", icon: "Zap", unlocked: false, requiredXp: 500 },
  { id: "3", name: "Master", description: "Earn 1000 XP", icon: "Crown", unlocked: false, requiredXp: 1000 },
];

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Load theme on start
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // ⭐ FIXED LOGIN — UserRole works now
  const login = (email: string) => {
    setUser({
      name: "Demo User",
      email: email,
      avatarUrl: "https://picsum.photos/200",
      role: UserRole.FREE,     // <- Now works!
      coins: 100,
      xp: 120,
      level: 1,
      dailyStreak: 3,
      joinedDate: new Date().toLocaleDateString(),
    });
  };

  const logout = () => setUser(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const earnCoins = (amount: number) => {
    if (!user) return;

    const newXp = user.xp + amount;

    const updatedBadges = badges.map((b) => {
      if (!b.unlocked && newXp >= b.requiredXp) {
        showToast(`Badge Unlocked: ${b.name}!`);
        return { ...b, unlocked: true };
      }
      return b;
    });

    setBadges(updatedBadges);

    setUser((prev) =>
      prev
        ? {
            ...prev,
            coins: prev.coins + amount,
            xp: newXp,
            level: Math.floor(newXp / 500) + 1,
          }
        : null
    );
  };

  const addHistoryItem = (item: Omit<HistoryItem, "id" | "timestamp">) => {
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
    };
    setHistory((prev) => [newItem, ...prev]);
    earnCoins(10);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        theme,
        toggleTheme,
        login,
        logout,
        history,
        addHistoryItem,
        earnCoins,
        badges,
        showToast,
        toast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
