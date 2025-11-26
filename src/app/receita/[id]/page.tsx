"use client";

import { useState } from "react";
import { ArrowLeft, Heart, Share2, Clock, Users, Flame, Star, Play, TrendingUp, MessageCircle, ChefHat } from "lucide-react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const recipeData = {
  id: 1,
  title: "Bowl de Açaí Fitness",
  description: "Um bowl de açaí delicioso e nutritivo, perfeito para começar o dia com energia e saúde.",
  image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&h=600&fit=crop",
  category: "fitness",
  time: "10 min",
  servings: 2,
  difficulty: "Fácil",
  rating: 4.8,
  reviews: 342,
  calories: 320,
  protein: 12,
  carbs: 45,
  fat: 8,
  ingredients: [
    "200g de polpa de açaí congelada",
    "1 banana congelada",
    "100ml de leite de coco",
    "1 colher de mel",
    "Granola para decorar",
    "Frutas frescas (morango, banana, kiwi)",
    "Coco ralado"
  ],
  instructions: [
    "Bata a polpa de açaí congelada com a banana e o leite de coco no liquidificador até obter uma consistência cremosa.",
    "Transfira para uma tigela e decore com granola, frutas frescas e coco ralado.",
    "Sirva imediatamente para manter a textura perfeita."
  ],
  videoUrl: "https://example.com/video.mp4", // Mock
  likes: 1240,
  comments: 89
};

const trendData = [
  { month: 'Jan', views: 400 },
  { month: 'Fev', views: 600 },
  { month: 'Mar', views: 800 },
  { month: 'Abr', views: 1200 },
  { month: 'Mai', views: 1800 },
  { month: 'Jun', views: 2400 }
];

const comments = [
  { id: 1, user: "Maria Silva", avatar: "MS", comment: "Ficou incrível! Fiz hoje e amei 😍", time: "2h atrás", likes: 12 },
  { id: 2, user: "João Santos", avatar: "JS", comment: "Melhor receita de açaí que já fiz!", time: "5h atrás", likes: 8 },
  { id: 3, user: "Ana Costa", avatar: "AC", comment: "Perfeito para o pós-treino 💪", time: "1d atrás", likes: 15 }
];

export default function ReceitaPage() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'nutrition'>('ingredients');

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-24">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-[#0D0D0D]/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-lg transition-all ${
                  isFavorite ? "bg-[#00FF7F] text-[#0D0D0D]" : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite && "fill-current"}`} />
              </button>
              <button className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image with Video */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={recipeData.image}
          alt={recipeData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/50 to-transparent" />
        
        {/* Video Play Button (Mock) */}
        <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#00FF7F] flex items-center justify-center hover:scale-110 transition-transform shadow-2xl shadow-[#00FF7F]/50">
          <Play className="w-8 h-8 text-[#0D0D0D] ml-1" />
        </button>

        {/* Stats Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-white">
              <Heart className="w-5 h-5 fill-current" />
              <span className="font-semibold">{recipeData.likes}</span>
            </div>
            <div className="flex items-center gap-1 text-white">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">{recipeData.comments}</span>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-[#00FF7F] text-[#0D0D0D] text-sm font-bold flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Trending
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title and Meta */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{recipeData.title}</h1>
          <p className="text-lg text-white/60 mb-6">{recipeData.description}</p>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <Clock className="w-5 h-5 text-[#00FF7F]" />
              <span className="text-sm font-medium">{recipeData.time}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <Users className="w-5 h-5 text-[#00FF7F]" />
              <span className="text-sm font-medium">{recipeData.servings} porções</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <Flame className="w-5 h-5 text-[#00FF7F]" />
              <span className="text-sm font-medium">{recipeData.calories} kcal</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <Star className="w-5 h-5 text-[#00FF7F] fill-current" />
              <span className="text-sm font-medium">{recipeData.rating} ({recipeData.reviews} avaliações)</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 border-b border-white/10 mb-6">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'ingredients'
                  ? "text-[#00FF7F] border-b-2 border-[#00FF7F]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Ingredientes
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'instructions'
                  ? "text-[#00FF7F] border-b-2 border-[#00FF7F]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Modo de Preparo
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'nutrition'
                  ? "text-[#00FF7F] border-b-2 border-[#00FF7F]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Nutrição
            </button>
          </div>

          {/* Tab Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {activeTab === 'ingredients' && (
                <div className="space-y-3">
                  {recipeData.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#00FF7F]" />
                      <span className="text-white/80">{ingredient}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'instructions' && (
                <div className="space-y-4">
                  {recipeData.instructions.map((instruction, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00FF7F] text-[#0D0D0D] font-bold flex items-center justify-center">
                        {index + 1}
                      </div>
                      <p className="text-white/80 pt-1">{instruction}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'nutrition' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#00FF7F]/10 to-transparent border border-[#00FF7F]/20">
                    <div className="text-3xl font-bold text-white mb-2">{recipeData.calories}</div>
                    <div className="text-sm text-white/60">Calorias</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
                    <div className="text-3xl font-bold text-white mb-2">{recipeData.protein}g</div>
                    <div className="text-sm text-white/60">Proteínas</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20">
                    <div className="text-3xl font-bold text-white mb-2">{recipeData.carbs}g</div>
                    <div className="text-sm text-white/60">Carboidratos</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20">
                    <div className="text-3xl font-bold text-white mb-2">{recipeData.fat}g</div>
                    <div className="text-sm text-white/60">Gorduras</div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Trend Chart */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#00FF7F]" />
                  Popularidade
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="month" stroke="#ffffff60" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#ffffff60" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #00FF7F30',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                    <Line type="monotone" dataKey="views" stroke="#00FF7F" strokeWidth={3} dot={{ fill: '#00FF7F', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <button className="w-full py-4 rounded-2xl bg-[#00FF7F] text-[#0D0D0D] font-bold hover:bg-[#00CC66] transition-all hover:scale-105 shadow-2xl shadow-[#00FF7F]/20">
                Começar a Cozinhar
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-[#00FF7F]" />
            Comentários ({comments.length})
          </h3>
          
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00FF7F] text-[#0D0D0D] font-bold flex items-center justify-center flex-shrink-0">
                    {comment.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{comment.user}</h4>
                      <span className="text-xs text-white/40">{comment.time}</span>
                    </div>
                    <p className="text-white/80 mb-2">{comment.comment}</p>
                    <button className="text-sm text-white/60 hover:text-[#00FF7F] transition-colors flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {comment.likes}
                    </button>
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
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-medium">Buscar</span>
          </Link>
          <Link href="/favoritos" className="flex flex-col items-center gap-1 text-white/60">
            <Heart className="w-5 h-5" />
            <span className="text-xs font-medium">Favoritos</span>
          </Link>
          <Link href="/perfil" className="flex flex-col items-center gap-1 text-white/60">
            <Users className="w-5 h-5" />
            <span className="text-xs font-medium">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
