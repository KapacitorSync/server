export type MemoryStats = {
  totalSystemMemory: string
  freeSystemMemory: string
  usedSystemMemory: string

  totalProcessHeap: string
  freeProcessHeap: string
  usedProcessHeap: string
}

export type CPUUsage = {
  idle: number
  total: number
}

export type StorageUsage = {
  total: string
  free: string
  used: string
}
