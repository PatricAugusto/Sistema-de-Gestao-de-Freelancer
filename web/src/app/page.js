"use client";
import { useState, useEffect } from 'react';
import { api } from '../service/api';
import { Clock, DollarSign, Play, Square, Save } from 'lucide-react';
import * as S from './styles.js'; 

export default function Dashboard() {
  const [report, setReport] = useState({ total_revenue: 0, total_time: "0h 0min" });
  const [tasks, setTasks] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    // Carregamento inicial de tudo
    async function loadInitialData() {
      const [resReport, resTasks, resProjects] = await Promise.all([
        api.get('/reports/summary'),
        api.get('/tasks'),
        api.get('/projects')
      ]);

      setReport(resReport.data);
      setTasks(resTasks.data);
      setProjects(resProjects.data);
      
      // Seleciona o primeiro projeto automaticamente se houver
      if (resProjects.data.length > 0) {
        setProjectId(resProjects.data[0].id);
      }
    }

    loadInitialData();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (s) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveTask = async () => {
    const duration_minutes = Math.max(1, Math.round(seconds / 60));
    
    try {
      await api.post('/tasks', {
        project_id: projectId,
        description: description || "Tarefa sem descrição",
        duration_minutes
      });

      // Resetar e atualizar dados
      setSeconds(0);
      setIsActive(false);
      setDescription("");
      
      // Refresh nos dados do dashboard
      const [resReport, resTasks] = await Promise.all([
        api.get('/reports/summary'),
        api.get('/tasks')
      ]);
      setReport(resReport.data);
      setTasks(resTasks.data);
      
      alert("Tarefa salva com sucesso!");
    } catch (error) {
      alert("Erro ao salvar tarefa.");
    }
  };

  useEffect(() => {
    api.get('/reports/summary').then(res => setReport(res.data));

    api.get('/tasks').then(res => setTasks(res.data));
  }, []);

  return (
    <S.Container>
      <S.Header>
        <h1>Freelance / OS _</h1>
      </S.Header>

      <S.TimerCard>
        <h2 style={{textTransform: 'uppercase', marginBottom: '1rem'}}>Painel de Controle_</h2>

        <div style={{ width: '100%' }}>
          <S.Label>Selecione o Projeto Ativo:</S.Label>
          <S.SelectBrutal 
            value={projectId} 
            onChange={(e) => setProjectId(e.target.value)}
          >
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name} (R$ {project.hourly_rate}/h)
              </option>
            ))}
            {projects.length === 0 && <option>Nenhum projeto encontrado</option>}
          </S.SelectBrutal>
        </div>

        <S.Label>O que você está fazendo?</S.Label>
        <S.InputBrutal 
          placeholder="Ex: Refatorando a API de Clientes" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        
        <div className="display">{formatTime(seconds)}</div>
        
        <div className="controls">
          {!isActive ? (
            <S.Button bg="#4ade80" onClick={() => setIsActive(true)}>
              <Play size={20} inline /> START
            </S.Button>
          ) : (
            <S.Button bg="#f87171" onClick={() => setIsActive(false)}>
              <Square size={20} inline /> STOP
            </S.Button>
          )}
          
          <S.Button bg="#F4E04D" onClick={handleSaveTask} disabled={seconds < 10}>
            <Save size={20} inline /> SALVAR
          </S.Button>
        </div>
      </S.TimerCard>

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

      <S.TableContainer>
        <h3>Logs de Atividade / Recentes</h3>
        <S.Table>
          <thead>
            <tr>
              <th>Projeto</th>
              <th>Descrição</th>
              <th>Duração</th>
              <th>Valor (R$)</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.project_name}</td>
                <td>{task.description}</td>
                <td>{task.duration_minutes} min</td>
                <td>R$ {Number(task.amount_earned).toFixed(2)}</td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                  Nenhuma tarefa registrada ainda...
                </td>
              </tr>
            )}
          </tbody>
        </S.Table>
      </S.TableContainer>
    </S.Container>
  );
}