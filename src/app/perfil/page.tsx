"use client";

import { useState } from "react";
import { ChefHat, Heart, Search, Award, TrendingUp, Flame, Star, Trophy, Target, Zap, ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";

const userStats = {
  name: "Chef Master",
  level: 12,
  xp: 2450,
  xpToNextLevel: 3000,
  recipesCompleted: 47,
  favoriteRecipes: 23,
  streak: 7
};

const badges = [
  { id: 1, name: "Iniciante", description: "Completou 5 receitas", icon: ChefHat, unlocked: true, color: "from-[#00FF7F] to-[#00CC66]" },
  { id: 2, name: "Fitness Pro", description: "10 receitas fitness", icon: Flame, unlocked: true, color: "from-orange-500 to-red-500" },
  { id: 3, name: "Viral Star", description: "5 receitas virais", icon: TrendingUp, unlocked: true, color: "from-purple-500 to-pink-500" },
  { id: 4, name: "Mestre Chef", description: "50 receitas completas", icon: Trophy, unlocked: false, color: "from-yellow-500 to-orange-500" },
  { id: 5, name: "Dedicado", description: "7 dias seguidos", icon: Target, unlocked: true, color: "from-blue-500 to-cyan-500" },
  { id: 6, name: "Relâmpago", description: "10 receitas rápidas", icon: Zap, unlocked: false, color: "from-yellow-400 to-yellow-600" }
];

const recentActivity = [
  { id: 1, recipe: "Bowl de Açaí Fitness", date: "Hoje", xp: 50 },
  { id: 2, recipe: "Smoothie Proteico Verde", date: "Ontem", xp: 30 },
  { id: 3, recipe: "Panqueca de Banana Viral", date: "2 dias atrás", xp: 75 }
];

export default function PerfilPage() {
  const progressPercentage = (userStats.xp / userStats.xpToNextLevel) * 100;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-24">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-[#0D0D0D]/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-white/60 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold">Perfil</h1>
            </div>

            <Link href="/configuracoes" className="text-white/60 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#00FF7F]/20 via-[#0D0D0D] to-[#0D0D0D] border border-[#00FF7F]/30 p-8 mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF7F]/10 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00FF7F] to-[#00CC66] flex items-center justify-center">
                  <ChefHat className="w-10 h-10 text-[#0D0D0D]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{userStats.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#00FF7F]/20 text-[#00FF7F] text-sm font-semibold">
                      Nível {userStats.level}
                    </span>
                    <span className="text-sm text-white/60">
                      🔥 {userStats.streak} dias de sequência
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* XP Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white/80">Progresso para Nível {userStats.level + 1}</span>
                <span className="text-sm font-bold text-[#00FF7F]">{userStats.xp} / {userStats.xpToNextLevel} XP</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00FF7F] to-[#00CC66] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-white mb-1">{userStats.recipesCompleted}</div>
                <div className="text-xs text-white/60">Receitas Completas</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-white mb-1">{userStats.favoriteRecipes}</div>
                <div className="text-xs text-white/60">Favoritos</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-white mb-1">{badges.filter(b => b.unlocked).length}</div>
                <div className="text-xs text-white/60">Conquistas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Conquistas</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`relative p-4 rounded-2xl border transition-all ${
                  badge.unlocked
                    ? "bg-white/5 border-white/10 hover:border-[#00FF7F]/50 hover:scale-105"
                    : "bg-white/[0.02] border-white/5 opacity-50"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center mx-auto mb-3 ${
                  !badge.unlocked && "grayscale"
                }`}>
                  <badge.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-sm font-bold text-white text-center mb-1">{badge.name}</h4>
                <p className="text-xs text-white/60 text-center">{badge.description}</p>
                
                {badge.unlocked && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#00FF7F] flex items-center justify-center">
                    <Star className="w-3 h-3 text-[#0D0D0D] fill-current" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00FF7F]/10 flex items-center justify-center">
                      <ChefHat className="w-5 h-5 text-[#00FF7F]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{activity.recipe}</h4>
                      <p className="text-xs text-white/60">{activity.date}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#00FF7F]/20 text-[#00FF7F] text-sm font-bold">
                    +{activity.xp} XP
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0D0D0D]/95 backdrop-blur-xl border-t border-white/10 z-50">
        <div className="flex items-center justify-around px-4 py-3">
          <Link href="/" className="flex flex-col items-center gap-1 text-white/60">
            <ChefHat className="w-5 h-5" />
            <span className="text-xs font-medium">Início</span>
          </Link>
          <Link href="/busca" className="flex flex-col items-center gap-1 text-white/60">
            <Search className="w-5 h-5" />
            <span className="text-xs font-medium">Buscar</span>
          </Link>
          <Link href="/favoritos" className="flex flex-col items-center gap-1 text-white/60">
            <Heart className="w-5 h-5" />
            <span className="text-xs font-medium">Favoritos</span>
          </Link>
          <Link href="/perfil" className="flex flex-col items-center gap-1 text-[#00FF7F]">
            <Award className="w-5 h-5" />
            <span className="text-xs font-medium">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
