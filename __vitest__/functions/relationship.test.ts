import determinateDeepRelationship from 'utils/determinateDeepRelationship'
import { assert, describe, it, expect } from 'vitest'

const family = [
  { name: 'mat', father: 'mike', mother: null },
  { name: 'luz', father: null, mother: 'deb' },
  { name: 'sebas', father: 'mat', mother: 'luz' },
  { name: 'pilar', father: 'mat', mother: 'luz' },
  { name: 'juan', father: 'mat', mother: 'luz' },
  { name: 'lupe2', father: null, mother: null },
  { name: 'ana', father: 'sebas', mother: 'lupe' },
  { name: 'jose', father: 'sebas', mother: 'lupe' },
  { name: 'carlos', father: null, mother: null },
  { name: 'luis', father: 'carlos', mother: 'pilar' },
  { name: 'emma', father: 'carlos', mother: 'pilar' },
  { name: 'lulu', father: 'ed', mother: 'clau' },
  { name: 'lupe', father: 'juan', mother: 'lulu' },
  { name: 'pepe', father: 'juan', mother: 'lulu' },
  { name: 'tam', father: 'juan', mother: 'lulu' },
  { name: 'dan', father: 'carlos', mother: 'lulu' },
  { name: 'cam', father: 'carlos', mother: 'lulu' },
  { name: 'emi', father: 'jose', mother: 'lulu' },
  { name: 'max', father: 'ed', mother: 'ana' },
  { name: 'mich', father: null, mother: null }
]
describe('Relationship validations', () => {
  it('none relation', () => {
    const p1 = 'mich'
    const r = null
    const p2 = 'tam'
    expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  })
  it('pepe y tam are brohters', () => {
    const p1 = 'pepe'
    const r = 'hermano/hermana'
    const p2 = 'tam'
    expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  })
  it('lulu is mom of pepe', () => {
    const p1 = 'lulu'
    const r = 'padre/madre'
    const p2 = 'pepe'
    expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  })
  it('juan is dad of pepe', () => {
    const p1 = 'juan'
    const r = 'padre/madre'
    const p2 = 'pepe'
    expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  })
  it('ana is hija of lupe', () => {
    const p1 = 'ana'
    const r = 'hija/hijo'
    const p2 = 'lupe'
    expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  })
  it('jose is hijo of sebas', () => {
    const p1 = 'jose'
    const r = 'hija/hijo'
    const p2 = 'sebas'
    expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  })
  it('jose is hijo of sebas', () => {
    const p1 = 'pepe'
    const r = 'hija/hijo'
    const p2 = 'lulu'
    expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  })
  it('jose is hijo of sebas', () => {
    const p1 = 'pepe'
    const r = 'hija/hijo'
    const p2 = 'lulu'
    expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  })
  it('cam is step brother of lupe', () => {
    const p1 = 'cam'
    const r = 'stepBrother'
    const p2 = 'lupe'
    expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  })

  it('dan is step brother of luis', () => {
    const p1 = 'dan'
    const r = 'stepBrother'
    const p2 = 'luis'
    expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  })

  it('pilar is tio of lupe', () => {
    const p1 = 'pilar'
    const r = 'tia/tio'
    const p2 = 'lupe'
    expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  })

  it('sebas is none of dan', () => {
    const p1 = 'sebas'
    const r = null
    const p2 = 'dan'
    expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  })

  it('jose is uncle of max', () => {
    const p1 = 'jose'
    const r = 'tia/tio'
    const p2 = 'max'
    expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  })

  it('luis is nephew of juan', () => {
    const p1 = 'luis'
    const r = 'sobrino/sobrina'
    const p2 = 'juan'
    expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  })

  it('max is cousin of emi', () => {
    const p1 = 'max'
    const r = 'primos/primas'
    const p2 = 'emi'
    expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  })

  it('ana is cousin of pepe', () => {
    const p1 = 'ana'
    const r = 'primos/primas'
    const p2 = 'pepe'
    expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  })

  it('mich is none of carlos', () => {
    const p1 = 'mich'
    const r = null
    const p2 = 'carlos'
    expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  })
  it('mich is none of max', () => {
    const p1 = 'mich'
    const r = null
    const p2 = 'max'
    expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  })

  it('carlos is padre/madre of luis', () => {
    const p1 = 'carlos'
    const r = 'padre/madre'
    const p2 = 'luis'
    expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  })

  // it('juan is 2°uncle of emi', () => {
  //   const p1 = 'juan'
  //   const r = 'tia/tio-2°'
  //   const p2 = 'emi'
  //   expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  // })

  // it('emi is step bro of dan', () => {
  //   const p1 = 'emi'
  //   const r = 'stepBrother'
  //   const p2 = 'dan'
  //   expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  // })
  // it('ana is none of cam', () => {
  //   const p1 = 'ana'
  //   const r = 'none'
  //   const p2 = 'cam'
  //   expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  // })

  // it('juan is dad of pepe', () => {
  //   const p1 = 'cam'
  //   const r = 'medio hermano'
  //   const p2 = 'lupe'
  //   expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  // })
  // it('juan is dad of pepe', () => {
  //   const p1 = 'luz'
  //   const r = 'abuela'
  //   const p2 = 'lupe'
  //   expect(determinateDeepRelationship(p1, p2, family)).toBe(r)
  // })
})
