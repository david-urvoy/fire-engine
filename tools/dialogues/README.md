# Script to override paths

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { generateDialogues } from '@david-urvoy/fire-engine/tools'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

await generateDialogues({
sourceDir: path.resolve(__dirname, '../content/dialogues'),
generatedDir: path.resolve(__dirname, '../.generated'),
})
