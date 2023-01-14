import { addDays, subDays } from 'date-fns'
import { defineStatusByDate } from 'utils/defineStatusByDate'
import { describe, expect, it } from 'vitest'

describe('Define status depends of a date', () => {
  it('should be success', () => {
    const date = addDays(new Date(), 6).getTime()
    expect(defineStatusByDate(date)).toBe('success')
  })
  it('should be error', () => {
    const date = subDays(new Date(), 6).getTime()
    expect(defineStatusByDate(date)).toBe('error')
  })
  it('should be warning', () => {
    const date = subDays(new Date(), 2).getTime()
    expect(defineStatusByDate(date)).toBe('warning')
  })
  it('should be warning', () => {
    const date = addDays(new Date(), 2).getTime()
    expect(defineStatusByDate(date)).toBe('warning')
  })
  it('should be warning', () => {
    const date = addDays(new Date(), 5).getTime()
    expect(defineStatusByDate(date)).toBe('warning')
  })
  it('should be warning', () => {
    const date = subDays(new Date(), 5).getTime()
    expect(defineStatusByDate(date)).toBe('warning')
  })
})
