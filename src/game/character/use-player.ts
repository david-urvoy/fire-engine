import { useGame } from '../game.context'
import { game } from '../game.store'

export function usePlayer() {
	const { entityManager } = useGame()

	return () => entityManager.get(game.controlledCharacter)
}
