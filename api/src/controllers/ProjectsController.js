const connection = require('../database/connection');

module.exports = {
  // Criar um novo projeto para um cliente específico
  async create(request, response) {
    const { name, hourly_rate, customer_id } = request.body;

    try {
      // Verifica se o cliente existe antes de criar o projeto
      const customer = await connection('customers')
        .where('id', customer_id)
        .first();

      if (!customer) {
        return response.status(404).json({ error: 'Cliente não encontrado.' });
      }

      const [id] = await connection('projects').insert({
        name,
        hourly_rate,
        customer_id,
        status: 'Pendente'
      });

      return response.status(201).json({ id, name, hourly_rate, customer_id });
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao criar projeto.' });
    }
  },

  // Listar projetos com os dados dos clientes (Join)
  async index(request, response) {
    const projects = await connection('projects')
      .join('customers', 'customers.id', '=', 'projects.customer_id')
      .select([
        'projects.*',
        'customers.name as customer_name',
        'customers.email as customer_email'
      ]);

    return response.json(projects);
  },

  // Alterar status (Ex: de Pendente para Concluído)
  async updateStatus(request, response) {
    const { id } = request.params;
    const { status } = request.body; // 'Pendente' ou 'Concluído'

    await connection('projects')
      .where('id', id)
      .update({ status });

    return response.status(204).send();
  }
};