const CONQUISTAS = [
  {
    id: 'primeiro_dia',
    nome: 'Primeiro Dia',
    desc: 'Registrou seu primeiro atendimento',
    icon: '⭐',
    check: (stats) => stats.totalAtendimentos >= 1,
  },
  {
    id: 'semana_completa',
    nome: 'Semana Completa',
    desc: '7 dias consecutivos registrando',
    icon: '🔥',
    check: (stats) => stats.streak >= 7,
  },
  {
    id: 'dez_clientes',
    nome: 'Formando Clientela',
    desc: 'Atendeu 10 clientes diferentes',
    icon: '👥',
    check: (stats) => stats.clientesUnicos >= 10,
  },
  {
    id: 'meta_batida',
    nome: 'Meta!',
    desc: 'Bateu a meta diária pela primeira vez',
    icon: '🎯',
    check: (stats) => stats.metasBatidas >= 1,
  },
  {
    id: 'mes_de_ouro',
    nome: 'Mês de Ouro',
    desc: '30 dias consecutivos registrando',
    icon: '🏅',
    check: (stats) => stats.streak >= 30,
  },
  {
    id: 'ticket_de_ouro',
    nome: 'Ticket de Ouro',
    desc: 'Um atendimento acima de R$200',
    icon: '💰',
    check: (stats) => stats.maiorTicket >= 200,
  },
  {
    id: 'cem_atendimentos',
    nome: 'Centenário',
    desc: '100 atendimentos registrados',
    icon: '💯',
    check: (stats) => stats.totalAtendimentos >= 100,
  },
  {
    id: 'mil_no_dia',
    nome: 'Dia de Ouro',
    desc: 'R$1.000 faturados em um único dia',
    icon: '👑',
    check: (stats) => stats.maiorDia >= 1000,
  },
  {
    id: 'top_performer',
    nome: 'Top Performer',
    desc: '3 meses acima da meta',
    icon: '🏆',
    check: (stats) => stats.mesesAcimaDaMeta >= 3,
  },
]

export default CONQUISTAS
