import { useState, useEffect } from 'react'
import PizzaTable from './components/PizzaTable'
import Results from './components/Results'
import AddPizzaModal from './components/AddPizzaModal'

const PIZZAS_INICIAIS = [
  { id: 1, nome: 'Calabresa', precoVenda: 52.0, custoIngredientes: 30.0, tempoFabricacao: 15, demandaMinima: 3, limiteMaximo: 12 },
  { id: 2, nome: 'File com Fritas', precoVenda: 84.0, custoIngredientes: 73.0, tempoFabricacao: 15, demandaMinima: 1, limiteMaximo: 6 },
  { id: 3, nome: 'Imperio', precoVenda: 58.0, custoIngredientes: 53.0, tempoFabricacao: 15, demandaMinima: 2, limiteMaximo: 10 },
  { id: 4, nome: 'Abacaxi Nevada', precoVenda: 68.0, custoIngredientes: 33.0, tempoFabricacao: 15, demandaMinima: 1, limiteMaximo: 8 },
  { id: 5, nome: 'Banana Nevada', precoVenda: 68.0, custoIngredientes: 33.0, tempoFabricacao: 15, demandaMinima: 1, limiteMaximo: 8 },
  { id: 6, nome: 'Chocotine', precoVenda: 68.0, custoIngredientes: 33.0, tempoFabricacao: 15, demandaMinima: 2, limiteMaximo: 10 },
]

const STORAGE_KEY = 'pizzaria_dados'

function carregarDados() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY)
    if (salvo) {
      const dados = JSON.parse(salvo)
      return dados
    }
  } catch (e) {
    console.error('Erro ao carregar dados:', e)
  }
  return null
}

function salvarDados(pizzas, proxId) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ pizzas, proxId }))
  } catch (e) {
    console.error('Erro ao salvar dados:', e)
  }
}

function otimizar(pizzas, horasTotais, producaoMaxima, entregaMaxima) {
  const tempoDisponivel = horasTotais * 60
  const limiteTotal = Math.min(producaoMaxima, entregaMaxima)

  // Calcula lucro por pizza
  const pizzasComLucro = pizzas.map(p => ({
    ...p,
    lucroUnitario: parseFloat((p.precoVenda - p.custoIngredientes).toFixed(2)),
    lucroPorMinuto: (p.precoVenda - p.custoIngredientes) / p.tempoFabricacao,
  }))

  const quantidades = {}
  pizzasComLucro.forEach(p => { quantidades[p.id] = 0 })

  let tempoUsado = 0
  let totalProduzido = 0

  // FASE 1: Atender demandas minimas primeiro
  const demandasAtendidas = []
  for (const pizza of pizzasComLucro) {
    const demanda = pizza.demandaMinima || 0
    if (demanda > 0) {
      const tempoNecessario = demanda * pizza.tempoFabricacao
      if (tempoUsado + tempoNecessario <= tempoDisponivel && totalProduzido + demanda <= limiteTotal && demanda <= pizza.limiteMaximo) {
        quantidades[pizza.id] = demanda
        tempoUsado += tempoNecessario
        totalProduzido += demanda
        demandasAtendidas.push(pizza.id)
      }
    }
  }

  // FASE 2: Otimizar resto com greedy por lucro/minuto
  const ordenadas = [...pizzasComLucro]
    .filter(p => quantidades[p.id] < p.limiteMaximo)
    .sort((a, b) => b.lucroPorMinuto - a.lucroPorMinuto)

  for (const pizza of ordenadas) {
    const qtdAtual = quantidades[pizza.id]
    const espacoLivre = pizza.limiteMaximo - qtdAtual
    const maxPorTempo = Math.floor((tempoDisponivel - tempoUsado) / pizza.tempoFabricacao)
    const maxPorTotal = limiteTotal - totalProduzido
    const adicional = Math.max(0, Math.min(espacoLivre, maxPorTempo, maxPorTotal))

    quantidades[pizza.id] += adicional
    tempoUsado += adicional * pizza.tempoFabricacao
    totalProduzido += adicional

    if (totalProduzido >= limiteTotal || tempoUsado >= tempoDisponivel) break
  }

  const lucroTotal = pizzasComLucro.reduce((acc, p) => acc + p.lucroUnitario * quantidades[p.id], 0)

  return {
    quantidades,
    lucroTotal: parseFloat(lucroTotal.toFixed(2)),
    tempoUsado,
    totalProduzido,
    pizzasComLucro,
  }
}

export default function App() {
  const dadosSalvos = carregarDados()
  const [pizzas, setPizzas] = useState(dadosSalvos?.pizzas || PIZZAS_INICIAIS)
  const [proxId, setProxId] = useState(dadosSalvos?.proxId || 7)
  const [config, setConfig] = useState({ horasTotais: 8, producaoMaxima: 50, entregaMaxima: 40 })
  const [resultado, setResultado] = useState(null)
  const [modalAberto, setModalAberto] = useState(false)

  useEffect(() => {
    salvarDados(pizzas, proxId)
  }, [pizzas, proxId])

  function handleConfigChange(e) {
    const { name, value } = e.target
    setConfig(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
  }

  function abrirModalAdicionar() {
    setModalAberto(true)
  }

  function adicionarPizza(novaPizza) {
    setPizzas(prev => [
      ...prev,
      { id: proxId, ...novaPizza },
    ])
    setProxId(prev => prev + 1)
  }

  function removerPizza(id) {
    setPizzas(prev => prev.filter(p => p.id !== id))
  }

  function atualizarPizza(id, campo, valor) {
    setPizzas(prev =>
      prev.map(p => p.id === id ? { ...p, [campo]: campo === 'nome' ? valor : parseFloat(valor) || 0 } : p)
    )
  }

  function calcular() {
    if (pizzas.length === 0) return
    const res = otimizar(pizzas, config.horasTotais, config.producaoMaxima, config.entregaMaxima)
    setResultado(res)
  }

  function limparDados() {
    if (confirm('Deseja realmente limpar todas as pizzas e restaurar os dados padrao?')) {
      localStorage.removeItem(STORAGE_KEY)
      setPizzas(PIZZAS_INICIAIS)
      setProxId(7)
      setResultado(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Calculadora de Maximização de Lucro
          </h1>
          <p className="text-center text-gray-500 mt-1 text-sm">
            Programação Linear — Pizzaria
          </p>
        </div>

        {/* Configurações Gerais */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">1. Configurações Gerais</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Horas totais disponíveis
              </label>
              <input
                type="number"
                name="horasTotais"
                value={config.horasTotais}
                onChange={handleConfigChange}
                min="1"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Produção máxima (pizzas/dia)
              </label>
              <input
                type="number"
                name="producaoMaxima"
                value={config.producaoMaxima}
                onChange={handleConfigChange}
                min="1"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Entregas máximas (pizzas/dia)
              </label>
              <input
                type="number"
                name="entregaMaxima"
                value={config.entregaMaxima}
                onChange={handleConfigChange}
                min="1"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Cadastro de Pizzas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">2. Cadastro de Pizzas</h2>
          <PizzaTable
            pizzas={pizzas}
            onAdicionar={abrirModalAdicionar}
            onRemover={removerPizza}
            onAtualizar={atualizarPizza}
            onLimpar={limparDados}
          />
        </div>

        {/* Botão Calcular */}
        <div className="flex justify-center mb-6">
          <button
            onClick={calcular}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow transition-colors text-base"
          >
            Calcular Otimização
          </button>
        </div>

        {/* Resultados */}
        {resultado && (
          <Results resultado={resultado} config={config} />
        )}

        {/* Modal Adicionar Pizza */}
        <AddPizzaModal
          aberto={modalAberto}
          onFechar={() => setModalAberto(false)}
          onSalvar={adicionarPizza}
        />
      </div>
    </div>
  )
}
