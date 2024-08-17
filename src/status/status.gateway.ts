import {
  WebSocketGateway,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket
} from '@nestjs/websockets'
import { Logger } from '@nestjs/common'

import ws from 'ws'
import os, { type CpuInfo } from 'os'

import type { CPUUsage, MemoryStats } from '@/status/types'

@WebSocketGateway((process.env.PORT as unknown as number) + 1 || 3001, {
  path: '/status'
})
export class StatusGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private memoryInterval: NodeJS.Timeout
  private cpuInterval: NodeJS.Timeout

  handleConnection(): void {
    Logger.log('Client connected to /health/memory')
  }

  handleDisconnect(): void {
    Logger.log('Client disconnected from /health/memory')

    clearInterval(this.memoryInterval)
    clearInterval(this.cpuInterval)
  }

  @SubscribeMessage('memoryUsage')
  memoryUsage(@ConnectedSocket() client: ws): void {
    const getStats = (): MemoryStats => {
      const totalMemory: number = os.totalmem() / (1024 * 1024 * 1024)
      const freeMemory: number = os.freemem() / (1024 * 1024 * 1024)
      const usedMemory: number = totalMemory - freeMemory

      const memoryUsage = process.memoryUsage()

      return {
        totalSystemMemory: totalMemory.toFixed(2),
        freeSystemMemory: freeMemory.toFixed(2),
        usedSystemMemory: usedMemory.toFixed(2),

        totalProcessHeap: (memoryUsage.heapTotal / (1024 * 1024)).toFixed(2),
        freeProcessHeap: (memoryUsage.heapTotal - memoryUsage.heapUsed / (1024 * 1024)).toFixed(2),
        usedProcessHeap: (memoryUsage.heapUsed / (1024 * 1024)).toFixed(2)
      } as MemoryStats
    }

    client.send(JSON.stringify(getStats()))

    this.memoryInterval = setInterval(() => {
      client.send(JSON.stringify(getStats()))
    }, 500)
  }

  private getCpuTimes(): CPUUsage {
    let idle: number = 0
    let total: number = 0

    os.cpus().forEach((cpu: CpuInfo): void => {
      idle += cpu.times.idle
      total += Object.values(cpu.times).reduce((sum: number, time: number): number => sum + time, 0)
    })

    return { idle, total }
  }

  @SubscribeMessage('cpuUsage')
  async cpuUsage(@ConnectedSocket() client: ws): Promise<void> {
    const getUsage = async (): Promise<number> => {
      const start: CPUUsage = this.getCpuTimes()
      await new Promise((resolve) => setTimeout(resolve, 500))
      const end: CPUUsage = this.getCpuTimes()

      const idleDiff: number = end.idle - start.idle
      const totalDiff: number = end.total - start.total
      if (totalDiff <= 0) {
        return 0
      }

      const cpuUsage: number = ((totalDiff - idleDiff) / totalDiff) * 100

      return parseFloat(cpuUsage.toFixed(2))
    }

    this.cpuInterval = setInterval(async (): Promise<void> => {
      client.send(
        JSON.stringify({
          usage: await getUsage()
        })
      )
    }, 500)
  }
}
