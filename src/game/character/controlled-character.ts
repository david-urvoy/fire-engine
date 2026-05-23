import { useSnapshot } from 'valtio'

import { entityManager } from '../entity/entity.manager'
import { game } from '../game.store'

export function useControlledCharacter() {
	const controlledCharacterName = useSnapshot(game).controlledCharacter
	const controlledCharacter = entityManager.get(controlledCharacterName)

	return controlledCharacter
}
