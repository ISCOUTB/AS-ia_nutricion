"use client"

import { useEffect, useRef } from "react"

interface NutritionChartProps {
  type: "distribution" | "growth" | "comparison"
}

export default function NutritionChart({ type }: NutritionChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Set dimensions based on parent
    const parent = canvasRef.current.parentElement
    if (parent) {
      canvasRef.current.width = parent.clientWidth
      canvasRef.current.height = 300
    }

    // Draw placeholder chart based on type
    if (type === "distribution") {
      drawDistributionChart(ctx, canvasRef.current.width, canvasRef.current.height)
    } else if (type === "growth") {
      drawGrowthChart(ctx, canvasRef.current.width, canvasRef.current.height)
    } else if (type === "comparison") {
      drawComparisonChart(ctx, canvasRef.current.width, canvasRef.current.height)
    }
  }, [type])

  return (
    <div className="w-full h-full">
      <canvas ref={canvasRef} className="w-full"></canvas>
    </div>
  )
}

function drawDistributionChart(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Draw pie chart placeholder
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(centerX, centerY) - 40

  const data = [
    { label: "Normal", value: 65, color: "#4ade80" },
    { label: "Riesgo", value: 24, color: "#fb923c" },
    { label: "Desnutrición", value: 11, color: "#f87171" },
  ]

  let startAngle = 0
  const total = data.reduce((sum, item) => sum + item.value, 0)

  // Draw legend
  const legendY = height - 30
  let legendX = 20

  data.forEach((item) => {
    const slice = (item.value / total) * 2 * Math.PI

    // Draw slice
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + slice)
    ctx.fillStyle = item.color
    ctx.fill()

    // Draw legend item
    ctx.fillStyle = item.color
    ctx.fillRect(legendX, legendY, 15, 15)

    ctx.fillStyle = "#000"
    ctx.font = "12px Arial"
    ctx.fillText(`${item.label}: ${item.value}%`, legendX + 20, legendY + 12)

    legendX += 120
    startAngle += slice
  })
}

function drawGrowthChart(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Draw line chart placeholder
  const padding = 40
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  // Draw axes
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, height - padding)
  ctx.lineTo(width - padding, height - padding)
  ctx.strokeStyle = "#ccc"
  ctx.stroke()

  // Draw months on x-axis
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  const xStep = chartWidth / (months.length - 1)

  ctx.fillStyle = "#666"
  ctx.font = "10px Arial"
  months.forEach((month, i) => {
    const x = padding + i * xStep
    ctx.fillText(month, x - 10, height - padding + 15)
  })

  // Draw weight data line
  const weightData = [16.2, 16.5, 16.8, 17.0, 17.2, 17.5, 17.8, 18.0, 18.2, 18.3, 18.4, 18.5]
  const maxWeight = Math.max(...weightData)
  const minWeight = Math.min(...weightData)
  const yScale = chartHeight / (maxWeight - minWeight)

  ctx.beginPath()
  weightData.forEach((weight, i) => {
    const x = padding + i * xStep
    const y = height - padding - (weight - minWeight) * yScale

    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }

    // Draw point
    ctx.fillStyle = "#7c3aed"
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fill()
  })

  ctx.strokeStyle = "#7c3aed"
  ctx.lineWidth = 2
  ctx.stroke()

  // Draw label
  ctx.fillStyle = "#000"
  ctx.font = "12px Arial"
  ctx.fillText("Peso (kg)", padding - 30, padding - 10)
}

function drawComparisonChart(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Draw bar chart placeholder
  const padding = 40
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  // Draw axes
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, height - padding)
  ctx.lineTo(width - padding, height - padding)
  ctx.strokeStyle = "#ccc"
  ctx.stroke()

  // Draw age groups on x-axis
  const ageGroups = ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6"]
  const xStep = chartWidth / ageGroups.length
  const barWidth = xStep * 0.4

  ctx.fillStyle = "#666"
  ctx.font = "10px Arial"
  ageGroups.forEach((age, i) => {
    const x = padding + i * xStep + xStep / 2
    ctx.fillText(age + " años", x - 15, height - padding + 15)
  })

  // Draw weight data bars
  const weightData = [9.5, 12.0, 14.2, 16.5, 18.5, 20.7]
  const maxWeight = Math.max(...weightData) * 1.2 // Add 20% for margin
  const yScale = chartHeight / maxWeight

  weightData.forEach((weight, i) => {
    const x = padding + i * xStep + xStep / 2 - barWidth / 2
    const barHeight = weight * yScale
    const y = height - padding - barHeight

    // Draw bar
    ctx.fillStyle = "#7c3aed"
    ctx.fillRect(x, y, barWidth, barHeight)

    // Draw weight value
    ctx.fillStyle = "#000"
    ctx.font = "10px Arial"
    ctx.fillText(weight.toString() + "kg", x + barWidth / 2 - 10, y - 5)
  })

  // Draw label
  ctx.fillStyle = "#000"
  ctx.font = "12px Arial"
  ctx.fillText("Peso promedio por grupo de edad (kg)", width / 2 - 100, padding - 10)
}

