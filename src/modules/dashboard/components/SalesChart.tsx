import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import MuiSvgIcon from '@components/MuiSvgIcon'
import type { ChartData } from "../types/dashboard.types"

interface SalesChartProps {
  data?: ChartData
}

export const SalesChart = ({ data }: SalesChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current || !data) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Ventas (S/)',
          data: data.datasets[0]?.data || [],
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderRadius: 8
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
          <MuiSvgIcon size={20}>lucide:trending-up</MuiSvgIcon>
          Ventas Mensuales
        </h3>
      </div>
      <div className="chart-card__body">
        <canvas ref={chartRef} height={250}></canvas>
      </div>
    </div>
  )
}