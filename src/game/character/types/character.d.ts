import type { Entity } from '../../entity/entity.model'

export interface Character<Id extends string> extends EntityType<Id> {
	id: Id
	firstName: string
	lastName: string
	age: number
}

export interface CharacterApi<
	CharacterId extends string = string,
	DialogueId extends string = string,
> extends Character<string> {
	triggerDialogue(dialogueId: DialogueId): void
	bark(message: string): void
	barkAt(characterId: CharacterId, message: string): void
	entity?: Entity
}
