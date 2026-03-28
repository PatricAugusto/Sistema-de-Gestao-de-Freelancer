"use client";

import { useState, useEffect } from 'react';
import { api } from '../service/api';
import { 
  Clock, 
  DollarSign, 
  Plus, 
  Play, 
  Square, 
  Save, 
  Filter, 
  Trash2, 
  Edit3, 
  X 
} from 'lucide-react';
import * as S from './styles.js';

export default function Dashboard() {
  // --- ESTADOS DE DADOS ---
  const [report, setReport] = useState({ total_revenue: 0, total_time: "0h 0min" });
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  // --- ESTADOS DO CRONÔMETRO (NOVA TAREFA) ---
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");

  // --- ESTADOS DE FILTROS ---
  const [filterProject, setFilterProject] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());

  // --- ESTADOS DE UX / MODAIS ---
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectRate, setNewProjectRate] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [editDuration, setEditDuration] = useState(0);
  const [editProjectId, setEditProjectId] = useState("");

  // --- LÓGICA DE CARREGAMENTO CENTRALIZADA ---
  async function loadData(projId = "", month = "", year = "2026") {
    try {
      let reportUrl = `/reports/summary?year=${year}`;
      if (month) reportUrl += `&month=${month}`;

      let tasksUrl = `/tasks`;
      if (projId) tasksUrl += `?project_id=${projId}`;

      const [resReport, resTasks] = await Promise.all([
        api.get(reportUrl),
        api.get(tasksUrl)
      ]);

      setReport(resReport.data);
      setTasks(resTasks.data);
    } catch (error) {
      console.error("Erro na comunicação com a API:", error);
    }
  }

  useEffect(() => {
    async function initialSetup() {
      const resProjects = await api.get('/projects');
      setProjects(resProjects.data);
      if (resProjects.data.length > 0) setProjectId(resProjects.data[0].id);
      loadData("", "", filterYear);
    }
    initialSetup();
  }, []);

  // --- CICLO DE VIDA DO TIMER ---
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
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

  // --- AÇÕES DE TAREFAS (CRUD) ---
  const handleSaveTask = async () => {
    const duration_minutes = Math.max(1, Math.round(seconds / 60));
    try {
      await api.post('/tasks', {
        project_id: projectId,
        description: description || "Tarefa sem descrição",
        duration_minutes
      });
      setSeconds(0);
      setIsActive(false);
      setDescription("");
      loadData(filterProject, filterMonth, filterYear);
    } catch (error) {
      alert("Erro ao salvar tarefa.");
    }
  };

  const openEditModal = (task) => {
    setEditingTaskId(task.id);
    setEditDescription(task.description);
    setEditDuration(task.duration_minutes);
    setEditProjectId(task.project_id);
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = async () => {
    try {
      await api.put(`/tasks/${editingTaskId}`, {
        description: editDescription,
        duration_minutes: Number(editDuration),
        project_id: editProjectId
      });
      setIsEditModalOpen(false);
      loadData(filterProject, filterMonth, filterYear);
      alert("Registro atualizado!");
    } catch (error) {
      alert("Erro ao atualizar tarefa.");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm("Deseja deletar este registro de tempo permanentemente?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      loadData(filterProject, filterMonth, filterYear);
    } catch (error) {
      alert("Erro ao excluir registro.");
    }
  };

  // --- AÇÕES DE PROJETOS ---
  const handleCreateProject = async () => {
    if (!newProjectName || !newProjectRate) return alert("Preencha todos os campos!");
    try {
      await api.post('/projects', {
        name: newProjectName,
        hourly_rate: Number(newProjectRate),
        customer_id: 1 
      });
      const res = await api.get('/projects');
      setProjects(res.data);
      setIsProjectModalOpen(false);
      setNewProjectName("");
      setNewProjectRate("");
    } catch (error) {
      alert("Erro ao criar projeto.");
    }
  };

  return (
    <S.Container>
      <S.Header>
        <h1>Freelance / OS _</h1>
      </S.Header>

      <div style={{ marginBottom: '2rem' }}>
        <S.Button bg="#5E60CE" style={{ color: 'white' }} onClick={() => setIsProjectModalOpen(true)}>
          <Plus size={20} style={{ marginRight: '8px' }} /> NOVO PROJETO
        </S.Button>
      </div>

      {/* TRACKER SECTION */}
      <S.TimerCard>
        <h2 style={{ textTransform: 'uppercase', fontSize: '0.9rem', opacity: 0.8 }}>Novo Registro de Tempo_</h2>
        
        <div style={{ width: '100%' }}>
          <S.Label>Projeto:</S.Label>
          <S.SelectBrutal value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </S.SelectBrutal>
        </div>

        <div style={{ width: '100%' }}>
          <S.Label>Descrição da Atividade:</S.Label>
          <S.InputBrutal 
            placeholder="No que você está trabalhando?" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        <div className="display">{formatTime(seconds)}</div>
        
        <div className="controls">
          {!isActive ? (
            <S.Button bg="#4ade80" onClick={() => setIsActive(true)}>
              <Play size={20} style={{ marginRight: '8px' }} /> START
            </S.Button>
          ) : (
            <S.Button bg="#f87171" onClick={() => setIsActive(false)}>
              <Square size={20} style={{ marginRight: '8px' }} /> STOP
            </S.Button>
          )}
          
          <S.Button bg="#F4E04D" onClick={handleSaveTask} disabled={seconds < 5}>
            <Save size={20} style={{ marginRight: '8px' }} /> SALVAR
          </S.Button>
        </div>
      </S.TimerCard>

      {/* FINANCE CARDS */}
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

      {/* HISTORIC & FILTERS */}
      <S.TableContainer>
        <h3 style={{ marginBottom: '1.5rem' }}>Logs e Filtros_</h3>
        
        <S.FilterBar>
          <div>
            <S.Label>Projeto:</S.Label>
            <S.SelectBrutal value={filterProject} onChange={(e) => setFilterProject(e.target.value)} style={{ marginBottom: 0 }}>
              <option value="">Todos os Projetos</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </S.SelectBrutal>
          </div>
          <div>
            <S.Label>Mês:</S.Label>
            <S.SelectBrutal value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} style={{ marginBottom: 0 }}>
              <option value="">O Ano Todo</option>
              <option value="01">Janeiro</option>
              <option value="02">Fevereiro</option>
              <option value="03">Março</option>
              <option value="04">Abril</option>
            </S.SelectBrutal>
          </div>
          <S.FilterButton onClick={() => loadData(filterProject, filterMonth, filterYear)}>
            <Filter size={18} style={{ marginRight: '8px' }} /> APLICAR
          </S.FilterButton>
        </S.FilterBar>

        <S.Table>
          <thead>
            <tr>
              <th>Projeto</th>
              <th>Descrição</th>
              <th>Tempo</th>
              <th>Ganho</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.project_name}</td>
                <td>{task.description}</td>
                <td>{task.duration_minutes}m</td>
                <td>R$ {Number(task.amount_earned).toFixed(2)}</td>
                <td>
                  <S.ActionButton bg="#fbbf24" onClick={() => openEditModal(task)}>
                    <Edit3 size={14} />
                  </S.ActionButton>
                  <S.ActionButton bg="#f87171" onClick={() => handleDeleteTask(task.id)}>
                    <Trash2 size={14} />
                  </S.ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </S.Table>
      </S.TableContainer>

      {/* MODAL: NOVO PROJETO */}
      {isProjectModalOpen && (
        <S.Overlay>
          <S.Modal>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>Novo Projeto_</h2>
              <X style={{ cursor: 'pointer' }} onClick={() => setIsProjectModalOpen(false)} />
            </div>
            <S.Label>Nome do Cliente/Projeto:</S.Label>
            <S.InputBrutal value={newProjectName} onChange={e => setNewProjectName(e.target.value)} />
            <S.Label>Valor por Hora (R$):</S.Label>
            <S.InputBrutal type="number" value={newProjectRate} onChange={e => setNewProjectRate(e.target.value)} />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <S.Button bg="#4ade80" onClick={handleCreateProject}>CRIAR</S.Button>
              <S.Button bg="#eee" onClick={() => setIsProjectModalOpen(false)}>CANCELAR</S.Button>
            </div>
          </S.Modal>
        </S.Overlay>
      )}

      {/* MODAL: EDITAR TAREFA */}
      {isEditModalOpen && (
        <S.Overlay>
          <S.Modal>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>Ajustar Registro_</h2>
              <X style={{ cursor: 'pointer' }} onClick={() => setIsEditModalOpen(false)} />
            </div>
            <S.Label>Projeto:</S.Label>
            <S.SelectBrutal value={editProjectId} onChange={e => setEditProjectId(e.target.value)}>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </S.SelectBrutal>
            <S.Label>Descrição:</S.Label>
            <S.InputBrutal value={editDescription} onChange={e => setEditDescription(e.target.value)} />
            <S.Label>Tempo (Minutos):</S.Label>
            <S.InputBrutal type="number" value={editDuration} onChange={e => setEditDuration(e.target.value)} />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <S.Button bg="#4ade80" onClick={handleUpdateTask}>SALVAR</S.Button>
              <S.Button bg="#eee" onClick={() => setIsEditModalOpen(false)}>CANCELAR</S.Button>
            </div>
          </S.Modal>
        </S.Overlay>
      )}
    </S.Container>
  );
}