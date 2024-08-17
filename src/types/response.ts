export type ApiResponse<T = Record<any, any>> = {
  message?: string
  body: T
}
