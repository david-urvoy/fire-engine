import type { DialogueRepository } from '../conversation/types/dialogue.repository'
import type { Entity } from '../entity/entity.model'
import type { CharacterApi } from './types/character'

export class Character implements CharacterApi<string, string> {
	id: string
	firstName: string
	lastName: string
	age: number
	entity?: Entity

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
		public dialogueRepository: DialogueRepository<string>,
	) {
		this.id = id
		this.firstName = firstName
		this.lastName = lastName
		this.age = age
	}

	triggerDialogue(dialogueId: string) {
		this.dialogueRepository.trigger(dialogueId)
	}

	bark(message: string) {
		console.log(`${this.firstName} barks: ${message}`)
	}

	barkAt(characterId: string, message: string) {
		console.log(`${this.firstName} barks at ${characterId}: ${message}`)
	}
}
