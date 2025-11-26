import { Plus, Minus, Trash2 } from 'lucide-react';

export default function ShoppingListPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-poppins font-bold text-[#00FF00] mb-6">
          Lista de Compras
        </h1>

        {/* Add Item */}
        <div className="mb-6">
          <div className="flex">
            <input
              type="text"
              placeholder="Adicionar item..."
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00FF00]"
            />
            <button className="bg-[#00FF00] text-black px-6 py-3 rounded-r-lg font-semibold hover:bg-green-400 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Shopping List */}
        <div className="space-y-4">
          {/* Item */}
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" className="mr-4 accent-[#00FF00]" />
              <span className="font-inter">Tomate</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-[#00FF00]">
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm">2</span>
              <button className="text-gray-400 hover:text-[#00FF00]">
                <Plus className="w-4 h-4" />
              </button>
              <button className="text-gray-400 hover:text-red-500 ml-4">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* More items */}
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" className="mr-4 accent-[#00FF00]" />
              <span className="font-inter">Cebola</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-[#00FF00]">
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm">1</span>
              <button className="text-gray-400 hover:text-[#00FF00]">
                <Plus className="w-4 h-4" />
              </button>
              <button className="text-gray-400 hover:text-red-500 ml-4">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" className="mr-4 accent-[#00FF00]" />
              <span className="font-inter">Alho</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-[#00FF00]">
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm">3</span>
              <button className="text-gray-400 hover:text-[#00FF00]">
                <Plus className="w-4 h-4" />
              </button>
              <button className="text-gray-400 hover:text-red-500 ml-4">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}