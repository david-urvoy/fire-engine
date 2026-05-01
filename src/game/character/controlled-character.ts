import { useSnapshot } from 'valtio'
import { game } from '../game.store'

export function useControlledCharacter() {
	const controlledCharacterName = useSnapshot(game).controlledCharacter
	const controlledCharacter = game.entities.get(controlledCharacterName)

	return controlledCharacter
}
