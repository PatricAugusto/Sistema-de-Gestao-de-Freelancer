const connection = require('../database/connection');
const knex = require('../database/connection');

module.exports = {
  async create(request, response) {
    const { project_id, description, duration_minutes } = request.body;

    try {
      // 1. Buscar o valor da hora (hourly_rate) do projeto vinculado
      const project = await connection('projects')
        .where('id', project_id)
        .select('hourly_rate')
        .first();

      if (!project) {
        return response.status(404).json({ error: 'Projeto não encontrado.' });
      }

      // 2. Calcular o valor ganho: (minutos / 60) * valor_hora
      const amount_earned = (duration_minutes / 60) * project.hourly_rate;

      // 3. Inserir a tarefa com o valor já calculado
      const [id] = await connection('tasks').insert({
        project_id,
        description,
        duration_minutes,
        amount_earned: amount_earned.toFixed(2), // Garante 2 casas decimais
      });

      return response.status(201).json({ 
        id, 
        description, 
        duration_minutes, 
        amount_earned 
      });

    } catch (error) {
      return response.status(500).json({ error: 'Erro ao registrar tarefa.' });
    }
  },

  async index(request, response) {
  const { project_id } = request.query; // Pega o ID do projeto via URL: ?project_id=1

  const query = connection('tasks')
    .join('projects', 'projects.id', '=', 'tasks.project_id')
    .select([
      'tasks.*',
      'projects.name as project_name'
    ])
    .orderBy('created_at', 'desc');

  // Se o usuário passou um ID de projeto, filtramos a query
  if (project_id) {
    query.where('tasks.project_id', project_id);
  }

  const tasks = await query;
  return response.json(tasks);
},

async report(request, response) {
  const { month, year } = request.query; // ?month=03&year=2026

  try {
    const query = connection('tasks')
      .sum('amount_earned as total_revenue')
      .sum('duration_minutes as total_minutes')
      .first();

    // Filtro por data no SQLite usando strftime
    if (month && year) {
      // Formato esperado no banco: 'YYYY-MM-DD'
      // O filtro abaixo busca registros onde o ano e mês coincidem
      query.whereRaw("strftime('%m', created_at) = ?", [month])
           .whereRaw("strftime('%Y', created_at) = ?", [year]);
    }

    const stats = await query;

    const hours = Math.floor((stats.total_minutes || 0) / 60);
    const minutes = (stats.total_minutes || 0) % 60;

    return response.json({
      total_revenue: stats.total_revenue || 0,
      total_time: `${hours}h ${minutes}min`,
      month_filtered: month || 'Todos',
      year_filtered: year || 'Todos'
    });
  } catch (error) {
    return response.status(500).json({ error: 'Erro ao gerar relatório filtrado.' });
  }
},

  async report(request, response) {
    try {
      const stats = await connection('tasks')
        .sum('amount_earned as total_revenue')
        .sum('duration_minutes as total_minutes')
        .first();

      // Convertendo minutos totais para um formato legível (ex: 2h 30min)
      const hours = Math.floor(stats.total_minutes / 60);
      const minutes = stats.total_minutes % 60;

      return response.json({
        total_revenue: stats.total_revenue || 0,
        total_time: `${hours}h ${minutes}min`,
        raw_minutes: stats.total_minutes || 0
      });
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao gerar relatório.' });
    }
  },

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
      console.error(error);
      return response.status(500).json({ error: 'Erro ao atualizar tarefa.' });
    }
  },

  async delete(request, response) {
    const { id } = request.params;

    try {
      const task = await knex('tasks').where({ id }).first();

      if (!task) {
        return response.status(404).json({ error: 'Tarefa não encontrada.' });
      }

      await knex('tasks').where({ id }).del();

      return response.status(204).send(); // 204 No Content (sucesso sem corpo de resposta)
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao deletar tarefa.' });
    }
  }
};