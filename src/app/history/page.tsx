import { Clock, Star } from 'lucide-react';

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-poppins font-bold text-[#00FF00] mb-6">
          Histórico de Receitas
        </h1>

        {/* History List */}
        <div className="space-y-4">
          {/* Recipe Item */}
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-700 rounded-lg mr-4"></div>
              <div>
                <h3 className="text-lg font-poppins font-semibold">Risoto de Cogumelos</h3>
                <p className="text-gray-300 text-sm">Cozinhado em 15 de outubro</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm ml-1">4.8</span>
              </div>
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">45 min</span>
            </div>
          </div>

          {/* More items */}
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-700 rounded-lg mr-4"></div>
              <div>
                <h3 className="text-lg font-poppins font-semibold">Salada Caesar</h3>
                <p className="text-gray-300 text-sm">Cozinhado em 12 de outubro</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm ml-1">4.5</span>
              </div>
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">20 min</span>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-700 rounded-lg mr-4"></div>
              <div>
                <h3 className="text-lg font-poppins font-semibold">Lasanha Bolonhesa</h3>
                <p className="text-gray-300 text-sm">Cozinhado em 10 de outubro</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm ml-1">4.9</span>
              </div>
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">90 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}