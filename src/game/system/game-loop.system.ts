import { VisualSystem } from '../../3d/visual.system'
import { GravitySystem } from '../../physics/gravity.system'
import { PhysicSystem } from '../../physics/physic.system'
import { DialogueSystem } from '../conversation/dialogue.system'

export class GameLoopSystem {
	gravity: GravitySystem = new GravitySystem()
	physic: PhysicSystem = new PhysicSystem()
	visual: VisualSystem = new VisualSystem()
	dialogue: DialogueSystem = new DialogueSystem()

	step(delta: number) {
		this.gravity.step(delta)
		this.physic.step(delta)
		this.visual.step(delta)
		this.dialogue.step(delta)
	}
}
