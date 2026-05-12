import { readdirSync } from 'node:fs'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { compileDialoguesFromExports } from './dialogues.compiler'

function findDialogueFiles(dir: string): string[] {
	const entries = readdirSync(dir, { withFileTypes: true })
	return entries.flatMap((entry) => {
		const fullPath = path.join(dir, entry.name)
		if (entry.isDirectory()) return findDialogueFiles(fullPath)
		if (entry.isFile() && entry.name.endsWith('.dialogue.ts')) return [fullPath]
		return []
	})
}

export async function generateDialogues(options: {
	sourceDir: string
	generatedDir: string
}): Promise<void> {
	const { sourceDir, generatedDir } = options
	const generatedDialoguesPath = path.join(generatedDir, 'dialogues.json')
	const manifestPath = path.join(generatedDir, 'dialogues.manifest.json')

	const dialogueFiles = findDialogueFiles(sourceDir)

	const [outputStat, existingJson, existingManifestJson] = await Promise.all([
		stat(generatedDialoguesPath).catch(() => null),
		readFile(generatedDialoguesPath, 'utf8').catch(() => '{}'),
		readFile(manifestPath, 'utf8').catch(() => '{}'),
	])

	const outputMtime = outputStat?.mtimeMs ?? 0
	const dialogues: Record<string, unknown> = JSON.parse(existingJson)
	const manifest: Record<string, string[]> = JSON.parse(existingManifestJson)

	const fileMtimes = await Promise.all(dialogueFiles.map((f) => stat(f).then((s) => s.mtimeMs)))
	const changedFiles = dialogueFiles.filter((_, i) => fileMtimes[i]! >= outputMtime)

	// Remove entries for files that no longer exist
	for (const relPath of Object.keys(manifest)) {
		if (!dialogueFiles.includes(path.join(sourceDir, relPath))) {
			for (const id of manifest[relPath] ?? []) delete dialogues[id]
			delete manifest[relPath]
		}
	}

	if (changedFiles.length === 0) {
		console.info('[dialogues:generate] Up to date, skipping.')
		return
	}

	// Recompile only changed files
	for (const file of changedFiles) {
		const relPath = path.relative(sourceDir, file)

		// Remove previous dialogue IDs from this file
		for (const id of manifest[relPath] ?? []) delete dialogues[id]

		const mod = await import(file)
		const compiled = compileDialoguesFromExports(mod)

		Object.assign(dialogues, compiled)
		manifest[relPath] = Object.keys(compiled)
	}

	const json = JSON.stringify(dialogues, null, 2)
	const manifestJson = JSON.stringify(manifest, null, 2)

	await mkdir(generatedDir, { recursive: true })
	await Promise.all([
		writeFile(generatedDialoguesPath, `${json}\n`, 'utf8'),
		writeFile(manifestPath, `${manifestJson}\n`, 'utf8'),
	])

	console.info(
		`[dialogues:generate] Wrote ${changedFiles.length} changed file(s), ${Object.keys(dialogues).length} total dialogue(s) to ${generatedDialoguesPath}`,
	)
}
