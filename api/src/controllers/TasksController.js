const knex = require('../database/connection');

module.exports = {
  // 1. LISTAGEM DE TAREFAS (Com cálculo dinâmico para garantir precisão)
  async index(request, response) {
    const { project_id } = request.query;

    try {
      let query = knex('tasks')
        .join('projects', 'projects.id', '=', 'tasks.project_id')
        .select(
          'tasks.*',
          'projects.name as project_name',
          // Cálculo dinâmico para evitar erros se o valor/hora do projeto mudar
          knex.raw('((projects.hourly_rate / 60.0) * tasks.duration_minutes) as amount_earned')
        )
        .orderBy('tasks.created_at', 'desc');

      if (project_id) {
        query = query.where('tasks.project_id', project_id);
      }

      const tasks = await query;
      return response.json(tasks);
    } catch (error) {
      console.error("Erro na listagem:", error);
      return response.status(500).json({ error: 'Erro ao listar tarefas.' });
    }
  },

  // 2. CRIAÇÃO DE TAREFA
  async create(request, response) {
    const { project_id, description, duration_minutes } = request.body;

    try {
      const project = await knex('projects')
        .where('id', project_id)
        .select('hourly_rate')
        .first();

      if (!project) {
        return response.status(404).json({ error: 'Projeto não encontrado.' });
      }

      // Cálculo preventivo para armazenamento (opcional, já que o index calcula dinamicamente)
      const amount_earned = (duration_minutes / 60.0) * project.hourly_rate;

      const [id] = await knex('tasks').insert({
        project_id,
        description,
        duration_minutes,
        amount_earned: amount_earned.toFixed(2),
      });

      return response.status(201).json({ id, description, amount_earned });
    } catch (error) {
      console.error("Erro ao criar:", error);
      return response.status(500).json({ error: 'Erro ao registrar tarefa.' });
    }
  },

  // 3. ATUALIZAÇÃO (UPDATE)
  async update(request, response) {
    const { id } = request.params;
    const { description, duration_minutes, project_id } = request.body;

    try {
      const task = await knex('tasks').where({ id }).first();

      if (!task) {
        return response.status(404).json({ error: 'Tarefa não encontrada.' });
      }

      await knex('tasks')
        .where({ id })
        .update({
          description,
          duration_minutes,
          project_id,
        });

      return response.json({ message: 'Tarefa atualizada com sucesso!' });
    } catch (error) {
      console.error("Erro no update:", error);
      return response.status(500).json({ error: 'Erro ao atualizar tarefa.' });
    }
  },

  // 4. EXCLUSÃO (DELETE)
  async delete(request, response) {
    const { id } = request.params;

    try {
      const task = await knex('tasks').where({ id }).first();

      if (!task) {
        return response.status(404).json({ error: 'Tarefa não encontrada.' });
      }

      await knex('tasks').where({ id }).del();

      return response.status(204).send();
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao deletar tarefa.' });
    }
  },

  // 5. SUMÁRIO / RELATÓRIO (O que alimenta os cards do dashboard)
  async summary(request, response) {
    const { month, year } = request.query;

    try {
      let query = knex('tasks')
        .join('projects', 'projects.id', '=', 'tasks.project_id')
        .select(
          knex.raw('SUM((projects.hourly_rate / 60.0) * tasks.duration_minutes) as total_revenue'),
          knex.raw('SUM(tasks.duration_minutes) as total_minutes_raw')
        );

      if (month) query = query.whereRaw("strftime('%m', tasks.created_at) = ?", [month]);
      if (year) query = query.whereRaw("strftime('%Y', tasks.created_at) = ?", [year]);

      const result = await query.first();

      const totalMinutes = result.total_minutes_raw || 0;
      const hrs = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;

      return response.json({
        total_revenue: result.total_revenue || 0,
        total_time: `${hrs}h ${mins}min`
      });
    } catch (error) {
      console.error("Erro no sumário:", error);
      return response.status(500).json({ error: 'Erro ao gerar sumário.' });
    }
  }
};