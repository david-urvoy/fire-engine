import type { EntityState } from '../entity/entity.types'

type ConversationBase = {
	id: string
	speakerId: EntityState['id']
}
