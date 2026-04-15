import { VisualSystem } from '../../3d/visual.system'
import { GravitySystem } from '../../physics/gravity.system'
import { PhysicSystem } from '../../physics/physic.system'
import type { DialogueRepository } from '../conversation'
import { DialogueSystem } from '../conversation/dialogue.system'

export class GameLoopSystem<DialogueId extends string = string> {
	dialogue: DialogueSystem<DialogueId>
	gravity: GravitySystem = new GravitySystem()
	physic: PhysicSystem = new PhysicSystem()
	visual: VisualSystem = new VisualSystem()

	constructor(dialogRepository: DialogueRepository<DialogueId>) {
		this.dialogue = new DialogueSystem(dialogRepository)
	}

	step(delta: number) {
		this.gravity.step(delta)
		this.physic.step(delta)
		this.visual.step(delta)
		this.dialogue.step(delta)
	}
}
