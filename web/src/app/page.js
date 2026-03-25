"use client";
import { useState, useEffect } from 'react';
import { api } from '../service/api';
import { Clock, DollarSign, Plus } from 'lucide-react';
import * as S from './styles.js'; 

export default function Dashboard() {
  const [report, setReport] = useState({ total_revenue: 0, total_time: "0h 0min" });

  useEffect(() => {
    api.get('/reports/summary').then(res => setReport(res.data));
  }, []);

  return (
    <S.Container>
      <S.Header>
        <h1>Freelance / OS _</h1>
      </S.Header>

      <S.StatsGrid>
        <S.Card>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <S.IconBox bg="#4ade80"><DollarSign size={24} /></S.IconBox>
            <h2>Faturamento</h2>
          </div>
          <p className="value">R$ {Number(report.total_revenue).toFixed(2)}</p>
        </S.Card>

        <S.Card rotate="rotate(1deg)">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <S.IconBox bg="#5E60CE" color="white"><Clock size={24} /></S.IconBox>
            <h2>Tempo Total</h2>
          </div>
          <p className="value">{report.total_time}</p>
        </S.Card>
      </S.StatsGrid>
    </S.Container>
  );
}