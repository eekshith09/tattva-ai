import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Common';
import { Award, Lock, Zap, Crown, Coins } from 'lucide-react';

export const Rewards = () => {
  const { user, badges } = useApp();

  const getIcon = (name: string) => {
    switch (name) {
      case 'Award': return Award;
      case 'Zap': return Zap;
      case 'Crown': return Crown;
      default: return Award;
    }
  };

  const nextLevelXp = (user?.level || 1) * 500;
  const progress = user ? (user.xp / nextLevelXp) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Crown className="w-64 h-64 transform rotate-12" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full border-4 border-white/30 bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <span className="text-4xl font-bold">{user?.level}</span>
            </div>
            <div>
              <p className="text-purple-100 font-medium mb-1">Current Level</p>
              <h2 className="text-3xl font-bold">{user?.name}</h2>
              <div className="flex items-center gap-2 mt-2 bg-white/20 px-3 py-1 rounded-full w-fit">
                <Coins className="w-4 h-4 text-yellow-300" />
                <span className="font-medium">{user?.coins} Coins</span>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/3">
            <div className="flex justify-between text-sm mb-2 font-medium">
              <span>{user?.xp} XP</span>
              <span>{nextLevelXp} XP</span>
            </div>
            <div className="h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
              <div 
                className="h-full bg-yellow-400 transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-purple-200 mt-2 text-right">
              {nextLevelXp - (user?.xp || 0)} XP to next level
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-6">Your Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {badges.map((badge) => {
            const Icon = getIcon(badge.icon);
            return (
              <Card 
                key={badge.id} 
                className={`relative overflow-hidden transition-all ${!badge.unlocked ? 'opacity-75 grayscale' : 'ring-2 ring-purple-100 dark:ring-purple-900'}`}
              >
                {!badge.unlocked && (
                  <div className="absolute inset-0 bg-slate-100/50 dark:bg-slate-900/50 flex items-center justify-center z-10">
                    <Lock className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${badge.unlocked ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-slate-100 text-slate-400'}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  {badge.unlocked && <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">UNLOCKED</span>}
                </div>
                
                <h4 className="text-lg font-bold mb-1">{badge.name}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{badge.description}</p>
                {!badge.unlocked && (
                  <div className="mt-4 text-xs font-medium text-slate-400">
                    Requires {badge.requiredXp} XP
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};