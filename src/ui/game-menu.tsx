import { useSnapshot } from 'valtio'

import { game } from '../game'
import { InventoryMenu } from './game-menu/inventory-menu'

export function GameMenu() {
	const { isOpen } = useSnapshot(game.gameMenu)

	if (!isOpen) return null

	return <InventoryMenu />
}
