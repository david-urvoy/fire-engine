import { useSnapshot } from 'valtio'
import { game } from '../game.store'

export function useControlledCharacter() {
	const controlledCharacterName = useSnapshot(game).controlledCharacter
	const controlledCharacter = game.entities.map[controlledCharacterName]

	return controlledCharacter
}
