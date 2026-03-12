import { VisualSystem } from '../../3d/visual.system'
import { GravitySystem } from '../../physics/gravity.system'
import { PhysicSystem } from '../../physics/physic.system'
import type { Character } from '../character/character'
import type { DialogueRepository } from '../conversation'
import { DialogueSystem } from '../conversation/conversation.system'

export class GameLoopSystem {
	dialogue: DialogueSystem
	gravity: GravitySystem = new GravitySystem()
	physic: PhysicSystem = new PhysicSystem()
	visual: VisualSystem = new VisualSystem()

	constructor(dialogRepository: DialogueRepository<string, Character<string>>) {
		this.dialogue = new DialogueSystem(dialogRepository)
	}

	step(delta: number) {
		this.gravity.step(delta)
		this.physic.step(delta)
		this.visual.step(delta)
		this.dialogue.step(delta)
	}
}
