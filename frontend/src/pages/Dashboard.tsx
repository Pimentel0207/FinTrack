import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { dashboardService } from '../services/dashboardService'
import type { DashboardSummary, DashboardChart } from '../services/dashboardService'

export function Dashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [chart, setChart] = useState<DashboardChart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [summaryData, chartData] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getChart(),
        ])
        setSummary(summaryData)
        setChart(chartData)
        setError(null)
      } catch (err) {
        setError('Erro ao carregar dashboard')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num)
  }

  if (loading) {
    return (
      <div style={{ padding: '24px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Carregando...</p>
      </div>
    )
  }

  if (error || !summary) {
    return (
      <div style={{ padding: '24px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--danger)' }}>{error || 'Erro ao carregar dados'}</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: 'var(--bg-deep)' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
          Olá, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Aqui está um resumo das suas finanças
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        {/* Real Balance */}
        <div className="glass" style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Saldo Real</p>
          <p style={{ fontSize: '24px', fontWeight: 700 }}>
            {formatCurrency(summary.real_balance)}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Entradas - Saídas</p>
        </div>

        {/* Income */}
        <div className="glass" style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          borderLeft: `4px solid var(--success)`,
        }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Entradas</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)' }}>
            {formatCurrency(summary.income)}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Este mês</p>
        </div>

        {/* Expenses */}
        <div className="glass" style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          borderLeft: `4px solid var(--danger)`,
        }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Saídas</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--danger)' }}>
            {formatCurrency(summary.expenses)}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Este mês</p>
        </div>

        {/* Goals */}
        <div className="glass" style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Metas</p>
          <p style={{ fontSize: '24px', fontWeight: 700 }}>
            {summary.goals_progress.toFixed(1)}%
          </p>
          <div style={{
            width: '100%',
            height: '4px',
            background: 'var(--glass-border)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${summary.goals_progress}%`,
              height: '100%',
              background: 'var(--accent)',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Chart */}
      {chart && (
        <div className="glass" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
            Fluxo de Caixa (6 meses)
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '16px',
          }}>
            {chart.data.map((point, idx) => (
              <div key={idx} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '12px',
                borderRadius: '8px',
                background: 'var(--glass-bg)',
              }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {point.month}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--success)' }}>
                  +{formatCurrency(point.income)}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--danger)' }}>
                  -{formatCurrency(point.expenses)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
