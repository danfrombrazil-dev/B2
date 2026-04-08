const toDateStr = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const yesterday = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return toDateStr(d)
}

const today = () => toDateStr()

export function calcStreak(streakData, atendimentosHoje) {
  const t = today()
  const y = yesterday()

  if (!streakData) {
    return atendimentosHoje > 0
      ? { count: 1, lastDate: t, shields: 0 }
      : { count: 0, lastDate: null, shields: 0 }
  }

  const { count, lastDate, shields } = streakData

  if (lastDate === t) return streakData

  if (atendimentosHoje > 0 && lastDate === y) {
    const newCount = count + 1
    const newShields = shields + (newCount % 7 === 0 ? 1 : 0)
    return { count: newCount, lastDate: t, shields: newShields }
  }

  if (atendimentosHoje > 0 && lastDate !== y) {
    if (shields > 0) {
      const newCount = count + 1
      return { count: newCount, lastDate: t, shields: shields - 1 }
    }
    return { count: 1, lastDate: t, shields: 0 }
  }

  return streakData
}

export function calcDailyProgress(atendimentos, metaDiaria) {
  const total = atendimentos.reduce((sum, a) => sum + (a.valor || 0) + (a.gorjeta || 0), 0)
  const percent = metaDiaria > 0 ? Math.min((total / metaDiaria) * 100, 100) : 0
  const exceeded = total > metaDiaria
  const exceededBy = exceeded ? total - metaDiaria : 0
  return { total, percent, exceeded, exceededBy, metaDiaria }
}

const LEVELS = [
  { name: 'Iniciante', minRevenue: 0 },
  { name: 'Profissional', minRevenue: 5000 },
  { name: 'Especialista', minRevenue: 15000 },
  { name: 'Referência', minRevenue: 40000 },
  { name: 'Mestre', minRevenue: 100000 },
]

export function calcLevel(totalRevenueAllTime) {
  let level = LEVELS[0]
  for (const l of LEVELS) {
    if (totalRevenueAllTime >= l.minRevenue) level = l
  }
  const idx = LEVELS.indexOf(level)
  const next = LEVELS[idx + 1] || null
  const progressToNext = next
    ? ((totalRevenueAllTime - level.minRevenue) / (next.minRevenue - level.minRevenue)) * 100
    : 100
  return { level: level.name, next: next?.name || null, progressToNext: Math.min(progressToNext, 100) }
}

export function filterByDate(atendimentos, period) {
  const now = new Date()
  const t = today()

  if (period === 'dia') {
    return atendimentos.filter((a) => a.data === t)
  }

  if (period === 'semana') {
    const startOfWeek = new Date(now)
    const day = startOfWeek.getDay()
    const diff = day === 0 ? 6 : day - 1
    startOfWeek.setDate(startOfWeek.getDate() - diff)
    const startStr = toDateStr(startOfWeek)
    return atendimentos.filter((a) => a.data >= startStr && a.data <= t)
  }

  if (period === 'mes') {
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    return atendimentos.filter((a) => a.data?.startsWith(prefix))
  }

  return atendimentos
}

export function filterLastWeek(atendimentos) {
  const now = new Date()
  const day = now.getDay()
  const diffToMonday = day === 0 ? 6 : day - 1

  const thisMonday = new Date(now)
  thisMonday.setDate(now.getDate() - diffToMonday)
  thisMonday.setHours(0, 0, 0, 0)

  const lastMonday = new Date(thisMonday)
  lastMonday.setDate(thisMonday.getDate() - 7)

  const lastSunday = new Date(thisMonday)
  lastSunday.setDate(thisMonday.getDate() - 1)

  const startStr = toDateStr(lastMonday)
  const endStr = toDateStr(lastSunday)

  return atendimentos.filter((a) => a.data >= startStr && a.data <= endStr)
}

export function calcStats(atendimentos, streakData, metaDiaria) {
  const totalAtendimentos = atendimentos.length
  const streak = streakData?.count || 0

  const clienteSet = new Set()
  atendimentos.forEach((a) => {
    if (a.clienteId) clienteSet.add(a.clienteId)
    else if (a.cliente) clienteSet.add(a.cliente.toLowerCase())
  })
  const clientesUnicos = clienteSet.size

  const maiorTicket = atendimentos.reduce((max, a) => {
    const v = (a.valor || 0) + (a.gorjeta || 0)
    return v > max ? v : max
  }, 0)

  const dayMap = {}
  atendimentos.forEach((a) => {
    if (!dayMap[a.data]) dayMap[a.data] = 0
    dayMap[a.data] += (a.valor || 0) + (a.gorjeta || 0)
  })
  const maiorDia = Object.values(dayMap).reduce((max, v) => (v > max ? v : max), 0)

  let metasBatidas = 0
  Object.values(dayMap).forEach((v) => {
    if (v >= metaDiaria) metasBatidas++
  })

  const metaMensal = metaDiaria * 22
  const monthMap = {}
  atendimentos.forEach((a) => {
    const prefix = a.data?.slice(0, 7)
    if (!prefix) return
    if (!monthMap[prefix]) monthMap[prefix] = 0
    monthMap[prefix] += (a.valor || 0) + (a.gorjeta || 0)
  })
  let mesesAcimaDaMeta = 0
  Object.values(monthMap).forEach((v) => {
    if (v >= metaMensal) mesesAcimaDaMeta++
  })

  const totalReceita = atendimentos.reduce((s, a) => s + (a.valor || 0) + (a.gorjeta || 0), 0)

  return {
    totalAtendimentos, streak, clientesUnicos, maiorTicket,
    maiorDia, metasBatidas, mesesAcimaDaMeta, totalReceita,
  }
}

export { toDateStr, today, yesterday, LEVELS }
