interface EntityType<Id extends string> {
	id: Id
}

export interface Character<Id extends string> extends EntityType<Id> {
	firstName: string
	lastName: string
	age: number
}
