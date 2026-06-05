import dotenv from 'dotenv'
dotenv.config()

import PQueue from 'p-queue'
import rateLimit from 'express-rate-limit'

import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'

import { imageToFen, getBoardImg } from 'chess-scan'

const app = express()

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
	fileFilter(req, file, cb) {
		if (!file.mimetype.startsWith('image/')) {
			return cb(new Error('Only image files are allowed'))
		}

		cb(null, true)
	},
})

const inferenceLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 5,
	handler: (req, res) => {
		res.status(429).json({
			error: 'Too many requests',
			retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
		})
	},
	skip: (req) => {
		return req.ip === '127.0.0.1' || req.ip === '::1'
	},
})

export const inferenceQueue = new PQueue({
	concurrency: 1,
	timeout: 30_000,
	throwOnTimeout: true,
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3000

app.set('trust proxy', 1)

app.use('/api', inferenceLimiter)

app.post('/api/getFen', upload.single('image'), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({
				error: 'No image uploaded',
			})
		}

		//queue is full
		if (inferenceQueue.size >= 10) {
			return res.status(429).json({
				error: 'Server is currently processing too many images. Please try again in a minute.',
				queueLength: inferenceQueue.size,
			})
		}

		const result = await inferenceQueue.add(async () => {
			const buffer = req.file.buffer

			const [fenResult, board] = await Promise.all([imageToFen(buffer), getBoardImg(buffer)])

			return {
				fen: fenResult.fen,
				confidence: fenResult.confidence,
				board: `data:image/png;base64,${Buffer.from(board).toString('base64')}`,
			}
		})

		res.json(result)
	} catch (error) {
		console.error(error)

		res.status(500).json({
			error: 'Failed to process image',
		})
	}
})

app.get('/ping', (req, res) => {
	res.status(200).send('pong')
})

// Serve React build
app.use(express.static(path.join(__dirname, 'dist')))

app.get(/.*/, (req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.use((err, req, res, next) => {
	if (err instanceof multer.MulterError) {
		if (err.code === 'LIMIT_FILE_SIZE') {
			return res.status(413).json({
				error: 'Image is too large. Maximum size is 15 MB.',
			})
		}

		return res.status(400).json({
			error: err.message,
		})
	}

	res.status(500).json({
		error: 'Internal server error',
	})
})

app.listen(PORT, () => {
	console.log(`Server running at  http://127.0.0.1:${PORT}`)
})
