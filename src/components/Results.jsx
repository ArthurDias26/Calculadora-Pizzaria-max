export default function Results({ resultado, config }) {
  const { quantidades, lucroTotal, tempoMaximoUsado, totalProduzido, pizzasComLucro, pizzaiolos } = resultado
  const horasUsadas = Math.floor(tempoMaximoUsado / 60)
  const minutosUsados = Math.round(tempoMaximoUsado % 60)

  const pizzasNaProducao = pizzasComLucro.filter(p => quantidades[p.id] > 0)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">3. Resultado da Otimização</h2>

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-sm text-green-600 font-medium">Lucro Máximo</p>
          <p className="text-2xl font-bold text-green-700 mt-1">
            R$ {lucroTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-600 font-medium">Tempo Utilizado</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">
            {horasUsadas}h {minutosUsados}min
          </p>
          <p className="text-xs text-blue-400 mt-1">
            de {config.horasTotais}h por pizzaiolo
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <p className="text-sm text-orange-600 font-medium">Total Produzido</p>
          <p className="text-2xl font-bold text-orange-700 mt-1">
            {totalProduzido} pizzas
          </p>
          <p className="text-xs text-orange-400 mt-1">
            de {Math.min(config.producaoMaxima, config.entregaMaxima)} possíveis
          </p>
        </div>
      </div>

      {/* Detalhes por pizzaiolo */}
      {config.numPizzaiolos > 1 && pizzaiolos && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
            Distribuicao por Pizzaiolo
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {pizzaiolos.map(p => (
              <div key={p.id} className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
                <p className="text-xs font-semibold text-gray-600">Pizzaiolo {p.id}</p>
                <p className="text-lg font-bold text-gray-800">{p.pizzasProduzidas} pizzas</p>
                <p className="text-xs text-gray-500">{Math.floor(p.tempoUsado / 60)}h {p.tempoUsado % 60}min</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de producao */}
      {pizzasNaProducao.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
            Plano de Producao
          </h3>
          <ul className="space-y-2">
            {pizzasNaProducao.map(p => (
              <li key={p.id} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                <span className="font-medium">
                  {p.nome || `Pizza ${p.id}`}
                </span>
                <span className="text-gray-400">→</span>
                <span>produzir <strong>{quantidades[p.id]}</strong> unidade{quantidades[p.id] !== 1 ? 's' : ''}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tabela detalhada */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
          Detalhamento
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-3 py-2 font-semibold text-gray-600">Pizza</th>
                <th className="text-center px-3 py-2 font-semibold text-gray-600">Produzir</th>
                <th className="text-center px-3 py-2 font-semibold text-gray-600">Lucro Unitário</th>
                <th className="text-center px-3 py-2 font-semibold text-gray-600">Lucro Total</th>
              </tr>
            </thead>
            <tbody>
              {pizzasComLucro.map(p => {
                const qtd = quantidades[p.id]
                const lucroLinha = (p.lucroUnitario * qtd).toFixed(2)
                return (
                  <tr
                    key={p.id}
                    className={`border-b border-gray-100 ${qtd > 0 ? 'bg-green-50' : ''}`}
                  >
                    <td className="px-3 py-2 font-medium text-gray-700">
                      {p.nome || `Pizza ${p.id}`}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`font-bold ${qtd > 0 ? 'text-green-700' : 'text-gray-400'}`}>
                        {qtd}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center text-gray-600">
                      R$ {p.lucroUnitario.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-center font-semibold text-gray-700">
                      R$ {lucroLinha}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 border-t-2 border-gray-300">
                <td colSpan={3} className="px-3 py-3 font-bold text-gray-700 text-right">
                  Lucro Total Máximo:
                </td>
                <td className="px-3 py-3 text-center font-bold text-green-700 text-base">
                  R$ {lucroTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Modelo matematico */}
      <div className="mt-6 bg-gray-50 rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
          Modelo Matematico
        </h3>
        <div className="text-sm text-gray-600 space-y-1 font-mono">
          <p><span className="font-semibold">Maximizar:</span> Z = Lucro Unitario x Quantidade Produzida</p>
          <p className="text-gray-400 text-xs mt-2 mb-1">Sujeito a:</p>
          <p>1. (TempoPizza x Qtd) / {config.numPizzaiolos} pizzaiolo{config.numPizzaiolos > 1 ? 's' : ''} nao deve exceder {config.horasTotais}h</p>
          <p>2. Qtd nao deve exceder {config.producaoMaxima} (producao max.)</p>
          <p>3. Qtd nao deve exceder {config.entregaMaxima} (entrega max.)</p>
          <p>4. Demanda Minima nao deve exceder Qtd nem LimitMax, para cada pizza</p>
          <p>5. Qtd deve ser maior ou igual a 0</p>
        </div>
      </div>
    </div>
  )
}
