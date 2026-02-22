import { VisualSystem } from '../../3d/visual.system'
import { GravitySystem } from '../../physics/gravity.system'
import { PhysicSystem } from '../../physics/physic.system'

export const GameLoopSystem = {
	step(delta: number) {
		GravitySystem.step(delta)
		PhysicSystem.step(delta)
		VisualSystem.step(delta)
	},

	systems: {
		gravity: GravitySystem,
		physic: PhysicSystem,
		visual: VisualSystem,
	},
}
