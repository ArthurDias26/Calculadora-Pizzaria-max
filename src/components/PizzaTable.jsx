export default function PizzaTable({ pizzas, onAdicionar, onRemover, onAtualizar, onLimpar }) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-3 py-2 font-semibold text-gray-600">Nome</th>
              <th className="text-left px-3 py-2 font-semibold text-gray-600">Preço Venda (R$)</th>
              <th className="text-left px-3 py-2 font-semibold text-gray-600">Custo Ingredientes (R$)</th>
              <th className="text-left px-3 py-2 font-semibold text-gray-600">Tempo Fabricação (min)</th>
              <th className="text-left px-3 py-2 font-semibold text-gray-600">Demanda Minima</th>
              <th className="text-left px-3 py-2 font-semibold text-gray-600">Limite Mximo</th>
              <th className="text-left px-3 py-2 font-semibold text-gray-600">Lucro Unitario (R$)</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {pizzas.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-400 italic">
                  Nenhuma pizza cadastrada. Clique em "+ Adicionar Pizza".
                </td>
              </tr>
            )}
            {pizzas.map(pizza => {
              const lucro = (pizza.precoVenda - pizza.custoIngredientes).toFixed(2)
              const lucroNum = parseFloat(lucro)
              return (
                <tr key={pizza.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={pizza.nome}
                      onChange={e => onAtualizar(pizza.id, 'nome', e.target.value)}
                      placeholder="Ex: Calabresa"
                      className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={pizza.precoVenda != 0 ? pizza.precoVenda : ''}
                      onChange={e => onAtualizar(pizza.id, 'precoVenda', e.target.value)}
                      step="0.01"
                      className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={pizza.custoIngredientes != 0 ? pizza.custoIngredientes : ''}
                      onChange={e => onAtualizar(pizza.id, 'custoIngredientes', e.target.value)}
                      step="0.01"
                      className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={pizza.tempoFabricacao != 0 ? pizza.tempoFabricacao : ''}
                      onChange={e => onAtualizar(pizza.id, 'tempoFabricacao', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={pizza.demandaMinima != 0 ? pizza.demandaMinima : ''}
                      onChange={e => onAtualizar(pizza.id, 'demandaMinima', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={pizza.limiteMaximo != 0 ? pizza.limiteMaximo : ''}
                      onChange={e => onAtualizar(pizza.id, 'limiteMaximo', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <span className={`font-semibold ${lucroNum >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      R$ {lucro}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => onRemover(pizza.id)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm border border-red-200 hover:border-red-400 rounded px-2 py-1 transition-colors"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex gap-3">
        <button
          onClick={onAdicionar}
          className="border border-blue-400 text-blue-600 hover:bg-blue-50 font-medium text-sm px-4 py-2 rounded transition-colors"
        >
          + Adicionar Pizza
        </button>
        <button
          onClick={onLimpar}
          className="border border-gray-400 text-gray-600 hover:bg-gray-50 font-medium text-sm px-4 py-2 rounded transition-colors"
        >
          Carregar Dados
        </button>
      </div>
    </div>
  )
}
