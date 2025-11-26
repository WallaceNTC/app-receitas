import { User, Trophy, Target, Settings } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-poppins font-bold text-[#00FF00] mb-6">
          Perfil do Usuário
        </h1>

        {/* Profile Header */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-[#00FF00] rounded-full flex items-center justify-center mr-4">
              <User className="w-8 h-8 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-poppins font-semibold">Nome do Usuário</h2>
              <p className="text-gray-300">chef@exemplo.com</p>
            </div>
          </div>
          <button className="bg-[#00FF00] text-black px-4 py-2 rounded-lg font-semibold hover:bg-green-400 transition-colors">
            Editar Perfil
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">
            <Trophy className="w-8 h-8 text-[#00FF00] mx-auto mb-2" />
            <h3 className="text-xl font-poppins font-semibold">250</h3>
            <p className="text-gray-300">Receitas Cozinhadas</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">
            <Target className="w-8 h-8 text-[#00FF00] mx-auto mb-2" />
            <div className="text-xl font-poppins font-semibold">15</div>
            <p className="text-gray-300">Badges Conquistados</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 text-center">
            <Settings className="w-8 h-8 text-[#00FF00] mx-auto mb-2" />
            <div className="text-xl font-poppins font-semibold">85%</div>
            <p className="text-gray-300">Taxa de Sucesso</p>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-poppins font-semibold mb-4">Preferências</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Notificações</span>
              <input type="checkbox" className="accent-[#00FF00]" defaultChecked />
            </div>
            <div className="flex justify-between items-center">
              <span>Dietas Especiais</span>
              <select className="bg-gray-700 border border-gray-600 rounded px-3 py-1">
                <option>Nenhuma</option>
                <option>Vegana</option>
                <option>Vegetariana</option>
                <option>Low Carb</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span>Idioma</span>
              <select className="bg-gray-700 border border-gray-600 rounded px-3 py-1">
                <option>Português</option>
                <option>Inglês</option>
                <option>Espanhol</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}