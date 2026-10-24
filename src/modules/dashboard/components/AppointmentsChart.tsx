import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import MuiSvgIcon from '@components/MuiSvgIcon'
import type { ChartData } from "../types/dashboard.types"

interface AppointmentsChartProps {
  data?: ChartData
}

export const AppointmentsChart = ({ data }: AppointmentsChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current || !data) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Citas',
          data: data.datasets[0]?.data || [],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3 className="chart-card__title">
          <MuiSvgIcon size={20}>lucide:calendar</MuiSvgIcon>
          Citas de la Semana
        </h3>
      </div>
      <div className="chart-card__body">
        <canvas ref={chartRef} height={250}></canvas>
      </div>
    </div>
  )
}