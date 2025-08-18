import { type FolderApi, Pane } from 'tweakpane'
import { addFolder } from './tweaks/abstract'
import { useDeclarativeTweaks } from './tweaks/declarative'
import { useImperativeTweaks } from './tweaks/imperative'


// Singleton pane instance
export const pane = new Pane()
export const folders: Record<string, FolderApi> = {}

// ---

export const Tweaks = {
	useDeclarative: useDeclarativeTweaks,
	useImperative: useImperativeTweaks,
	addFolder
}
