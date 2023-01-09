export interface Member {
  name: string
  father: string | null
  mother: string | null
}
const determinateDeepRelationship = (p1: string, p2: string, fam: Member[]) => {
  const getParents = (
    p?: Member['name'] | null,
    fam?: Member[]
  ): Member | null => {
    const found = fam?.find((member) => member.name === p)
    return found || null
  }
  const p1Parents = getParents(p1, fam)
  const p2Parents = getParents(p2, fam)

  // const getGrandparents = (p: string): (Member | null)[] => {
  //   const parents = getParents(p, fam)
  //   const grandparents = [
  //     getParents(parents?.father, fam),
  //     getParents(parents?.mother, fam)
  //   ]
  //   return grandparents
  // }

  // **************************************** Are brothers

  if (
    p1Parents?.father === p2Parents?.father &&
    p1Parents?.mother === p2Parents?.mother
  ) {
    return 'hermano/hermana'
  }
  // **************************************** Are father or mother
  if (
    p2Parents?.mother === p1Parents?.name ||
    p2Parents?.father === p1Parents?.name
  ) {
    return 'padre/madre'
  }

  // **************************************** Are father or soon
  if (p1Parents?.mother === p2 || p1Parents?.father === p2) {
    return 'hija/hijo'
  }

  // **************************************** Are step brother or step sister or soon

  if (
    p1Parents?.father === p2Parents?.father ||
    p1Parents?.mother === p2Parents?.mother
  ) {
    return 'stepBrother'
  }

  // ****************************************  Are uncle or ant

  const getGrandparents = (p: string): (string | null)[] => {
    const parents = getParents(p, fam)

    const grandparents = [
      getParents(parents?.father, fam)?.father || null,
      getParents(parents?.father, fam)?.mother || null,
      getParents(parents?.mother, fam)?.father || null,
      getParents(parents?.mother, fam)?.mother || null
    ]
    return grandparents
  }

  const p2Grandparents = getGrandparents(p2)
  const p1Grandparents = getGrandparents(p1)

  // p1 is uncle of p2
  console.log({ p1Grandparents, p2Grandparents, p2, p1, p1Parents })

  // ****************************************  Are cousins
  for (let i = 0; i < p1Grandparents.length; i++) {
    for (let j = 0; j < p2Grandparents.length; j++) {
      if (
        (p2Grandparents[i] && p1Grandparents.includes(p2Grandparents[i])) ||
        (p1Grandparents[j] && p2Grandparents.includes(p1Grandparents[j]))
      )
        return 'primos/primas'
    }
  }

  for (let j = 0; j < [p1Parents?.father, p1Parents?.mother].length; j++) {
    for (let i = 0; i < p2Grandparents.length; i++) {
      if (
        p1Parents?.father === p2Grandparents[i] ||
        p1Parents?.mother === p2Grandparents[i] ||
        p1Parents?.father === p2Grandparents[j] ||
        p1Parents?.mother === p2Grandparents[j]
      )
        return 'tia/tio'
    }
  }

  // ****************************************  Are nice or nephew
  for (let i = 0; i < p1Grandparents.length; i++) {
    for (let j = 0; j < [p2Parents?.father, p2Parents?.mother].length; j++) {
      if (
        p2Parents?.father === p1Grandparents[i] ||
        p2Parents?.mother === p1Grandparents[i] ||
        p2Parents?.father === p1Grandparents[j] ||
        p2Parents?.mother === p1Grandparents[j]
      )
        return 'sobrino/sobrina'
    }
  }

  return 'any'
}

export default determinateDeepRelationship
