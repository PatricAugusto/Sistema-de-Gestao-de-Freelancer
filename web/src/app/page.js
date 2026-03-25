"use client";

import { useState, useEffect } from 'react';
import { api } from '@/service/api';
import { Clock, DollarSign, Briefcase, Plus } from 'lucide-react';

export default function Dashboard() {
  const [report, setReport] = useState({ total_revenue: 0, total_time: "0h 0min" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await api.get('/reports/summary');
        setReport(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados da API", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-[#f0f0f0] p-8 text-black font-mono">
      {/* Header Brutalista */}
      <header className="mb-12 -rotate-1 bg-brutal-yellow border-4 border-black p-6 shadow-brutal inline-block">
        <h1 className="text-4xl font-black uppercase tracking-tighter">
          Freelance / OS _
        </h1>
      </header>

      {/* Grid de Stats com Dados Reais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border-4 border-black p-6 shadow-brutal transition-all">
          <div className="flex items-center gap-4 mb-4">
            <DollarSign size={32} className="bg-green-400 border-2 border-black p-1" />
            <h2 className="font-bold text-xl uppercase">Faturamento Total</h2>
          </div>
          <p className="text-3xl font-black">
            {loading ? "..." : `R$ ${Number(report.total_revenue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          </p>
        </div>

        <div className="bg-white border-4 border-black p-6 shadow-brutal rotate-1">
          <div className="flex items-center gap-4 mb-4">
            <Clock size={32} className="bg-brutal-blue text-white border-2 border-black p-1" />
            <h2 className="font-bold text-xl uppercase">Tempo Total</h2>
          </div>
          <p className="text-3xl font-black">{loading ? "..." : report.total_time}</p>
        </div>

        <button className="bg-white border-4 border-black p-6 shadow-brutal -rotate-1 hover:bg-black hover:text-white transition-colors group">
          <div className="flex items-center gap-4 mb-4">
            <Plus size={32} className="bg-orange-400 text-black border-2 border-black p-1 group-hover:bg-white" />
            <h2 className="font-bold text-xl uppercase">Novo Projeto</h2>
          </div>
          <p className="text-lg font-bold">Adicionar agora &gt;</p>
        </button>
      </div>

      {/* Lista de Tarefas (Próxima etapa) */}
      <section className="bg-white border-4 border-black p-8 shadow-brutal">
        <h3 className="text-2xl font-black mb-6 uppercase underline decoration-brutal-blue">
          Logs de Atividade
        </h3>
        {/* Aqui faremos o map das tarefas em breve */}
        <p className="italic">Pronto para listar as tarefas do banco...</p>
      </section>
    </main>
  );
}