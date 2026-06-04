import { useEffect, useState } from 'react'
import Board from '../board/Board'
import Input from './Input'
import styles from './Scan.module.css'
import Util from './Util'

export default function Scan() {
	const [image, setImage] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')

	async function upload(file) {
		if (!file) return
		try {
			setLoading(true)
			setError(null)

			const formData = new FormData()
			formData.append('image', file)

			const response = await fetch('/api/getFen', {
				method: 'POST',
				body: formData,
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Upload failed')
			}

			setImage(data.board)
			setFen(data.fen)
		} catch (err) {
			console.error(err)
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (error) setImage(null)
	}, [error])

	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<div className={`${styles.box}`}>
					<Input
						image={image}
						setImage={setImage}
						loading={loading}
						error={error}
						upload={upload}
					/>
				</div>
				<div className={styles.box}>{<Board fen={fen} setFen={setFen} />}</div>
			</div>
			<div className={styles.util}>
				<Util fen={fen} setFen={setFen} />
			</div>
		</div>
	)
}
