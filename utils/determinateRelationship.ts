import { ParentsType } from 'types/base/AnimalType.model'
import determinateDeepRelationship, {
  Member
} from './determinateDeepRelationship'

export interface Sheep {
  earring: string
  father?: string
  mother?: string
}

const RELATIONSHIP_GRADE = {
  zero: {
    grade: 0,
    relationship: 'ninguna'
  },
  one: {
    grade: 1,
    relationship: 'padres hermanos hijos'
  }, // father mother or brothers
  two: {
    grade: 2,
    relationship: 'sobrinos primos tios abuelos'
  }, // uncle sibiling grandparent,
  tree: {
    grade: 3,
    relationship: '2° sobrinos primos, tios, abuelos '
  }, // uncle second sibiling second grand-grand,
  four: {
    grade: 4,
    relationship: '3° sobrinos primos, tios, abuelos terceros'
  } // uncle third sibiling third grand-grand-grand,
}

export const determinateRelationship = (
  sheep1: string,
  sheep2: string,
  cattle?: { earring: string; parents?: ParentsType }[]
): { grade: number; type: string } => {
  const family: Member[] =
    cattle?.map(({ earring, parents }): Member => {
      return {
        father: parents?.father?.earring || null,
        mother: parents?.mother?.earring || null,
        name: earring
      }
    }) || []
  const res = determinateDeepRelationship(sheep1, sheep2, family)
  // console.log({ res })
  const grade = {
    none: 0,
    'padre/madre': 1,
    'hija/hijo': 1,
    'hermano/hermana': 1,
    stepBrother: 2,
    'primos/primas': 2,
    'tia/tio': 2,
    'sobrino/sobrina': 2
  }
  return { grade: grade[res], type: res }
  // const getParents = (
  //   sheep?: string | null
  // ): [father: Sheep['father'] | null, mother: Sheep['mother'] | null] => {
  //   const getSheep = (
  //     earring: string,
  //     cattle?: { earring: string; parents?: ParentsType }[]
  //   ): Sheep | void => {
  //     if (!cattle?.length) return console.log('no animals list')
  //     const sheep = cattle?.find((sheep) => sheep?.earring === earring)
  //     return {
  //       earring: sheep?.earring || '',
  //       father: sheep?.parents?.father?.earring || '',
  //       mother: sheep?.parents?.mother?.earring || ''
  //     }
  //   }
  //   const father = getSheep(sheep || '', cattle)?.father || null
  //   const mother = getSheep(sheep || '', cattle)?.mother || null
  //   return [father, mother]
  // }

  // const sheep1Parents = getParents(sheep1)
  // const sheep2Parents = getParents(sheep2)
  // //console.log({ sheep1, sheep2 })

  // if (sheep1Parents[0] === null || sheep2Parents[0] === null)
  //   return RELATIONSHIP_GRADE.zero
  // if (sheep1Parents[1] === null || sheep2Parents[1] === null)
  //   return RELATIONSHIP_GRADE.zero
  // if (sheep2Parents.includes(sheep1)) {
  //   return RELATIONSHIP_GRADE.one
  // }
  // if (sheep1Parents.includes(sheep2)) {
  //   return RELATIONSHIP_GRADE.one
  // }
  // if (
  //   sheep1Parents[0] === sheep2Parents[0] &&
  //   sheep1Parents[1] === sheep2Parents[1]
  // ) {
  //   return RELATIONSHIP_GRADE.one
  // }
  // // console.log({ sheep1Parents, sheep2Parents })

  // // Si sus padres no son los mismos, verificamos si comparten al menos un padre o una madre
  // if (
  //   sheep1Parents[0] === sheep2Parents[0] ||
  //   sheep1Parents[1] === sheep2Parents[1] ||
  //   sheep1Parents[0] === sheep2Parents[1] ||
  //   sheep1Parents[1] === sheep2Parents[0]
  // ) {
  //   return RELATIONSHIP_GRADE.two
  // }

  // const sheep1Grandparents = getParents(sheep1Parents[0]).concat(
  //   getParents(sheep1Parents[1])
  // )
  // const sheep2Grandparents = getParents(sheep2Parents?.[0]).concat(
  //   getParents(sheep2Parents?.[1])
  // )

  // if (sheep1Parents[0] === sheep2 || sheep1Parents[1] === sheep2) {
  //   return RELATIONSHIP_GRADE.two //'Tío';
  // }
  // if (sheep2Parents[0] === sheep1 || sheep2Parents[1] === sheep1) {
  //   return RELATIONSHIP_GRADE.two //'Sobrino';
  // }

  // if (sheep1Grandparents.includes(sheep2)) {
  //   return RELATIONSHIP_GRADE.two
  // }
  // if (sheep2Grandparents.includes(sheep1)) {
  //   return RELATIONSHIP_GRADE.two
  // }

  // // console.log({ sheep1Grandparents, sheep2Grandparents })

  // for (let i = 0; i < sheep1Grandparents.length; i++) {
  //   for (let j = 0; j < sheep2Grandparents.length; j++) {
  //     if (!sheep1Grandparents[i]) return RELATIONSHIP_GRADE.zero
  //     if (!sheep2Grandparents[i]) return RELATIONSHIP_GRADE.zero
  //     if (sheep1Grandparents[i] === sheep2Grandparents[j]) {
  //       return RELATIONSHIP_GRADE.two
  //     }
  //   }
  // }

  // return RELATIONSHIP_GRADE.zero
}
