import { dialogueStore, type DialogueRepository } from '../conversation'
import type { Entity } from '../entity/entity.model'
import type { CharacterApi } from './types/character'

export class Character implements CharacterApi<string, string> {
	id: string
	firstName: string
	lastName: string
	age: number
	entity?: Entity
	dialogueRepository: DialogueRepository<string>

	constructor({
		id,
		firstName,
		lastName,
		age,
		dialogueRepository,
	}: {
		id: string
		firstName: string
		lastName: string
		age: number
		dialogueRepository: DialogueRepository<string>
	}) {
		this.id = id
		this.firstName = firstName
		this.lastName = lastName
		this.age = age
		this.dialogueRepository = dialogueRepository
	}

	triggerDialogue(dialogueId: string) {
		const dialogue = this.dialogueRepository.createPlayerDialogue(dialogueId)
		if (dialogue) dialogueStore.active = dialogue
	}

	bark(message: string) {
		console.log(`${this.firstName} barks: ${message}`)
	}

	barkAt(characterId: string, message: string) {
		console.log(`${this.firstName} barks at ${characterId}: ${message}`)
	}
}
