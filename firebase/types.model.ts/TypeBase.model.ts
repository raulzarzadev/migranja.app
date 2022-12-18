export interface TypeBase {
  id: string
  createdAt: string
  updatedAt: string
  userId: string
}

export type DateType = 'string' | 'number' | Date
