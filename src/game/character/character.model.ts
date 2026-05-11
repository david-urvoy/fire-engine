import type { DialogueManager } from '../conversation/dialogue/dialogue.manager'
import { entityManager } from '../entity/entity.manager'
import type { Entity } from '../entity/entity.model'
import type { CharacterApi } from './types/character'

export class Character implements CharacterApi<string, string> {
	id: string
	firstName: string
	lastName: string
	age: number

	constructor(
		{
			id,
			firstName,
			lastName,
			age,
		}: {
			id: string
			firstName: string
			lastName: string
			age: number
		},
		public dialogueManager: DialogueManager<string>,
	) {
		this.id = id
		this.firstName = firstName
		this.lastName = lastName
		this.age = age
	}

	triggerDialogue(dialogueId: string) {
		this.dialogueManager.trigger(dialogueId)
	}

	bark(message: string) {
		console.log(`${this.firstName} barks: ${message}`)
	}

	barkAt(characterId: string, message: string) {
		console.log(`${this.firstName} barks at ${characterId}: ${message}`)
	}

	get entity(): Entity | undefined {
		return entityManager.get(this.id)
	}
}
