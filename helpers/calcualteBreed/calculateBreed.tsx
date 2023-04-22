export interface Parent {
  breed?: string
}

export interface ParensBirthEvent {
  mother?: Parent
  father?: Parent
}

export interface BreedingResult {
  breed: string
}

export function calculateBreed(
  parensBirthEvent: ParensBirthEvent
): BreedingResult {
  const motherBreed = parensBirthEvent.mother?.breed?.trim()
  const fatherBreed = parensBirthEvent.father?.breed?.trim()

  let breed = ''
  if (!motherBreed || !fatherBreed) {
    breed = motherBreed || fatherBreed || ''
  } else if (fatherBreed === motherBreed) {
    breed = `${fatherBreed}*100%`
  } else {
    const motherPercent = parseInt(
      motherBreed.split('*')[1].replace('%', ''),
      10
    )
    const fatherPercent = 100 - motherPercent
    breed = `${motherBreed}*${motherPercent}%+${fatherBreed}*${fatherPercent}%`
  }

  return { breed }
}
