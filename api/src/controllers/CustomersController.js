const connection = require('../database/connection');

module.exports = {
  async create(request, response) {
    const { name, email } = request.body;

    try {
      const [id] = await connection('customers').insert({
        name,
        email,
      });

      return response.status(201).json({ id, name, email });
    } catch (error) {
      return response.status(400).json({ error: "Erro ao cadastrar cliente. Verifique se o e-mail já existe." });
    }
  },

  // Rota de Listagem (Read) - Bom para testar se gravou!
  async index(request, response) {
    const customers = await connection('customers').select('*');
    return response.json(customers);
  }
};