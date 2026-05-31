import { useState } from 'react'

export default function AddPizzaModal({ aberto, onFechar, onSalvar }) {
  const [form, setForm] = useState({
    nome: '',
    precoVenda: '',
    custoIngredientes: '',
    tempoFabricacao: '20',
    demandaMinima: '0',
    limiteMaximo: '10',
  })

  function handleInput(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSalvar() {
    if (!form.nome.trim()) {
      alert('Informe o nome da pizza')
      return
    }
    const novaPizza = {
      nome: form.nome.trim(),
      precoVenda: parseFloat(form.precoVenda) || 0,
      custoIngredientes: parseFloat(form.custoIngredientes) || 0,
      tempoFabricacao: parseInt(form.tempoFabricacao) || 20,
      demandaMinima: parseInt(form.demandaMinima) || 0,
      limiteMaximo: parseInt(form.limiteMaximo) || 10,
    }

    if (novaPizza.demandaMinima > novaPizza.limiteMaximo) {
      alert('A demanda minima nao pode ser maior que o limite maximo')
      return
    }

    onSalvar(novaPizza)
    setForm({
      nome: '',
      precoVenda: '',
      custoIngredientes: '',
      tempoFabricacao: '20',
      demandaMinima: '0',
      limiteMaximo: '10',
    })
    onFechar()
  }

  if (!aberto) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Adicionar Nova Pizza</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nome da Pizza *</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleInput}
              placeholder="Ex: Margherita"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Preco Venda (R$)</label>
              <input
                type="number"
                name="precoVenda"
                value={form.precoVenda}
                onChange={handleInput}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Custo Ingredientes (R$)</label>
              <input
                type="number"
                name="custoIngredientes"
                value={form.custoIngredientes}
                onChange={handleInput}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tempo Fabricacao (minutos)</label>
            <input
              type="number"
              name="tempoFabricacao"
              value={form.tempoFabricacao}
              onChange={handleInput}
              min="1"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Demanda Minima</label>
              <input
                type="number"
                name="demandaMinima"
                value={form.demandaMinima}
                onChange={handleInput}
                min="0"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Limite Maximo</label>
              <input
                type="number"
                name="limiteMaximo"
                value={form.limiteMaximo}
                onChange={handleInput}
                min="0"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {form.precoVenda && form.custoIngredientes && (
            <div className="bg-gray-50 rounded px-3 py-2 text-sm">
              <span className="text-gray-600">Lucro Unitario: </span>
              <span className={`font-semibold ${parseFloat(form.precoVenda) >= parseFloat(form.custoIngredientes) ? 'text-green-600' : 'text-red-500'}`}>
                R$ {((parseFloat(form.precoVenda) || 0) - (parseFloat(form.custoIngredientes) || 0)).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onFechar}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  )
}
