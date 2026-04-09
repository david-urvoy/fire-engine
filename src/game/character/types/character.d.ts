import type { Entity } from '../../entity/entity.model'

interface EntityType<Id extends string> {
	id: Id
}

export interface Character<Id extends string> extends EntityType<Id> {
	firstName: string
	lastName: string
	age: number
}

export interface CharacterApi extends Character<string> {
	speakWith(characterId: string, dialogueId: string): void
	bark(message: string)
	barkAt(characterId: string, message: string)
	entity?: Entity
}
