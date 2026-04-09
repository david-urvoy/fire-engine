import type { Entity } from '../entity/entity.model'
import type { CharacterApi } from './types/character'

export class Character implements CharacterApi {
	id: string
	firstName: string
	lastName: string
	age: number
	entity?: Entity

	constructor(id: string, firstName: string, lastName: string, age: number) {
		this.id = id
		this.firstName = firstName
		this.lastName = lastName
		this.age = age
	}

	speakWith(characterId: string, dialogueId: string) {
		console.log(`${this.firstName} speaks with ${characterId} about ${dialogueId}`)
	}

	bark(message: string) {
		console.log(`${this.firstName} barks: ${message}`)
	}

	barkAt(characterId: string, message: string) {
		console.log(`${this.firstName} barks at ${characterId}: ${message}`)
	}
}
