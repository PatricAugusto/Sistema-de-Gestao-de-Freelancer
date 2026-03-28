"use client";

import { useState, useEffect } from "react";
import { api } from "../service/api";
import {
  Clock,
  DollarSign,
  Plus,
  Play,
  Square,
  Save,
  Filter,
} from "lucide-react";
import * as S from "./styles.js";

export default function Dashboard() {
  // --- ESTADOS DE DADOS ---
  const [report, setReport] = useState({
    total_revenue: 0,
    total_time: "0h 0min",
  });
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  // --- ESTADOS DO CRONÔMETRO ---
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");

  // --- ESTADOS DOS FILTROS ---
  const [filterProject, setFilterProject] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString(),
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectRate, setNewProjectRate] = useState("");

  // Função para salvar novo projeto
  const handleCreateProject = async () => {
    if (!newProjectName || !newProjectRate)
      return alert("Preencha todos os campos!");

    try {
      await api.post("/projects", {
        name: newProjectName,
        hourly_rate: Number(newProjectRate),
        customer_id: 1, // Por enquanto vinculando ao cliente 1
      });

      // Atualiza a lista de projetos
      const res = await api.get("/projects");
      setProjects(res.data);

      // Limpa e fecha
      setNewProjectName("");
      setNewProjectRate("");
      setIsModalOpen(false);
      alert("Projeto adicionado!");
    } catch (error) {
      alert("Erro ao criar projeto.");
    }
  };

  // --- LÓGICA DE CARREGAMENTO E FILTROS ---
  async function loadData(projId = "", month = "", year = "2026") {
    try {
      // Endpoint de Relatório com Query Params
      let reportUrl = `/reports/summary?year=${year}`;
      if (month) reportUrl += `&month=${month}`;

      // Endpoint de Tarefas com Query Params
      let tasksUrl = `/tasks`;
      if (projId) tasksUrl += `?project_id=${projId}`;

      const [resReport, resTasks] = await Promise.all([
        api.get(reportUrl),
        api.get(tasksUrl),
      ]);

      setReport(resReport.data);
      setTasks(resTasks.data);
    } catch (error) {
      console.error("Erro ao carregar dados da API:", error);
    }
  }

  // Carregamento Inicial
  useEffect(() => {
    async function initialSetup() {
      const resProjects = await api.get("/projects");
      setProjects(resProjects.data);

      if (resProjects.data.length > 0) {
        setProjectId(resProjects.data[0].id);
      }

      // Carrega dados iniciais sem filtros específicos
      loadData("", "", filterYear);
    }
    initialSetup();
  }, []);

  // --- CICLO DE VIDA DO CRONÔMETRO ---
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
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
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // --- AÇÕES ---
  const handleSaveTask = async () => {
    const duration_minutes = Math.max(1, Math.round(seconds / 60));

    try {
      await api.post("/tasks", {
        project_id: projectId,
        description: description || "Tarefa sem descrição",
        duration_minutes,
      });

      // Resetar cronômetro
      setSeconds(0);
      setIsActive(false);
      setDescription("");

      // Atualizar Dashboard
      loadData(filterProject, filterMonth, filterYear);
      alert("Tarefa salva com sucesso!");
    } catch (error) {
      alert("Erro ao salvar tarefa. Verifique a conexão com o back-end.");
    }
  };

  return (
    <S.Container>
      <S.Header>
        <h1>Freelance / OS _</h1>
      </S.Header>

      <S.Button
        bg="#5E60CE"
        style={{ color: "white", marginBottom: "2rem" }}
        onClick={() => setIsModalOpen(true)}
      >
        <Plus
          size={20}
          style={{ marginRight: "8px", verticalAlign: "middle" }}
        />
        CADASTRAR NOVO PROJETO
      </S.Button>

      {/* MODAL DE CADASTRO */}
      {isModalOpen && (
        <S.Overlay>
          <S.Modal>
            <h2>Novo Projeto_</h2>

            <S.Label>Nome do Projeto:</S.Label>
            <S.InputBrutal
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Ex: App de Entregas"
            />

            <S.Label>Valor da Hora (R$):</S.Label>
            <S.InputBrutal
              type="number"
              value={newProjectRate}
              onChange={(e) => setNewProjectRate(e.target.value)}
              placeholder="Ex: 100"
            />

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <S.Button bg="#4ade80" onClick={handleCreateProject}>
                SALVAR
              </S.Button>
              <S.Button bg="#f87171" onClick={() => setIsModalOpen(false)}>
                CANCELAR
              </S.Button>
            </div>
          </S.Modal>
        </S.Overlay>
      )}

      {/* PAINEL DE CONTROLE / CRONÔMETRO */}
      <S.TimerCard>
        <h2 style={{ textTransform: "uppercase", marginBottom: "1rem" }}>
          Painel de Controle_
        </h2>

        <div style={{ width: "100%" }}>
          <S.Label>Projeto Ativo:</S.Label>
          <S.SelectBrutal
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </S.SelectBrutal>
        </div>

        <div style={{ width: "100%" }}>
          <S.Label>O que está desenvolvendo?</S.Label>
          <S.InputBrutal
            placeholder="Ex: Refatoração de componentes"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="display">{formatTime(seconds)}</div>

        <div className="controls">
          {!isActive ? (
            <S.Button bg="#4ade80" onClick={() => setIsActive(true)}>
              <Play
                size={20}
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />{" "}
              START
            </S.Button>
          ) : (
            <S.Button bg="#f87171" onClick={() => setIsActive(false)}>
              <Square
                size={20}
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />{" "}
              STOP
            </S.Button>
          )}

          <S.Button
            bg="#F4E04D"
            onClick={handleSaveTask}
            disabled={seconds < 10}
          >
            <Save
              size={20}
              style={{ marginRight: "8px", verticalAlign: "middle" }}
            />{" "}
            SALVAR
          </S.Button>
        </div>
      </S.TimerCard>

      {/* CARDS DE ESTATÍSTICAS */}
      <S.StatsGrid>
        <S.Card>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <S.IconBox bg="#4ade80">
              <DollarSign size={24} />
            </S.IconBox>
            <h2>Faturamento</h2>
          </div>
          <p className="value">R$ {Number(report.total_revenue).toFixed(2)}</p>
        </S.Card>

        <S.Card rotate="rotate(1deg)">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <S.IconBox bg="#5E60CE" color="white">
              <Clock size={24} />
            </S.IconBox>
            <h2>Tempo Total</h2>
          </div>
          <p className="value">{report.total_time}</p>
        </S.Card>
      </S.StatsGrid>

      {/* FILTROS E TABELA */}
      <S.TableContainer>
        <h3>Logs de Atividade / Filtros</h3>

        <S.FilterBar>
          <div>
            <S.Label>Filtrar por Projeto:</S.Label>
            <S.SelectBrutal
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              style={{ marginBottom: 0 }}
            >
              <option value="">Todos os Projetos</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </S.SelectBrutal>
          </div>

          <div>
            <S.Label>Mês:</S.Label>
            <S.SelectBrutal
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              style={{ marginBottom: 0 }}
            >
              <option value="">O Ano Todo</option>
              <option value="01">Janeiro</option>
              <option value="02">Fevereiro</option>
              <option value="03">Março</option>
              <option value="04">Abril</option>
              <option value="05">Maio</option>
              <option value="06">Junho</option>
            </S.SelectBrutal>
          </div>

          <S.FilterButton
            onClick={() => loadData(filterProject, filterMonth, filterYear)}
          >
            <Filter
              size={18}
              style={{ marginRight: "8px", verticalAlign: "middle" }}
            />{" "}
            APLICAR
          </S.FilterButton>
        </S.FilterBar>

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
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.project_name}</td>
                <td>{task.description}</td>
                <td>{task.duration_minutes} min</td>
                <td>R$ {Number(task.amount_earned).toFixed(2)}</td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  Nenhum registro encontrado para este filtro.
                </td>
              </tr>
            )}
          </tbody>
        </S.Table>
      </S.TableContainer>
    </S.Container>
  );
}
