import { api } from '@/services/api';
import { Clock, DollarSign, Briefcase, Users } from 'lucide-react';

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#f0f0f0] p-8 text-black font-mono">
      {/* Header com Ângulo Criativo */}
      <header className="mb-12 -rotate-1 bg-brutal-yellow border-4 border-black p-6 shadow-brutal inline-block">
        <h1 className="text-4xl font-black uppercase tracking-tighter">
          Freelance / OS _
        </h1>
      </header>

      {/* Grid de Stats (Neobrutalismo) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border-4 border-black p-6 shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
          <div className="flex items-center gap-4 mb-4">
            <DollarSign size={32} className="bg-green-400 border-2 border-black p-1" />
            <h2 className="font-bold text-xl uppercase">Faturamento</h2>
          </div>
          <p className="text-3xl font-black">R$ 4.500,00</p>
        </div>

        <div className="bg-white border-4 border-black p-6 shadow-brutal rotate-1">
          <div className="flex items-center gap-4 mb-4">
            <Clock size={32} className="bg-brutal-blue text-white border-2 border-black p-1" />
            <h2 className="font-bold text-xl uppercase">Horas Março</h2>
          </div>
          <p className="text-3xl font-black">42h 15min</p>
        </div>

        <div className="bg-white border-4 border-black p-6 shadow-brutal -rotate-1">
          <div className="flex items-center gap-4 mb-4">
            <Briefcase size={32} className="bg-orange-400 border-2 border-black p-1" />
            <h2 className="font-bold text-xl uppercase">Projetos Ativos</h2>
          </div>
          <p className="text-3xl font-black">04</p>
        </div>
      </div>

      {/* Seção de Conteúdo */}
      <section className="bg-white border-4 border-black p-8 shadow-brutal relative overflow-hidden">
        {/* Detalhe de ângulo decorativo no canto */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-brutal-yellow border-l-4 border-b-4 border-black -rotate-12 translate-x-12 -translate-y-12"></div>
        
        <h3 className="text-2xl font-black mb-6 uppercase tracking-widest underline decoration-brutal-blue">
          Tarefas Recentes
        </h3>
        
        <p className="italic text-gray-600">Conectando ao Back-end...</p>
      </section>
    </main>
  );
}