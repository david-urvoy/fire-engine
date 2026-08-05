import { GravitySystem } from '../../physics/gravity.system'
import { PhysicSystem } from '../../physics/physic.system'
import { DialogueSystem } from '../conversation/dialogue/dialogue.system'

export class GameLoopSystem {
	gravity = new GravitySystem()
	physic = new PhysicSystem()
	dialogue = new DialogueSystem()

	step(delta: number) {
		this.gravity.step(delta)
		this.physic.step(delta)
		this.dialogue.step(delta)
	}
}
