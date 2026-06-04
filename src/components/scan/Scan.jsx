import { useEffect, useState } from 'react'
import Board from '../board/Board'
import Input from './Input'
import styles from './Scan.module.css'
import Util from './Util'

export default function Scan() {
	const [image, setImage] = useState(null)

	const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')

	useEffect(() => {
		console.log(fen)
	}, [fen])

	useEffect(() => {
		console.log(image)
	}, [image])

	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<div className={`${styles.box}`}>
					<Input image={image} setImage={setImage} />
				</div>
				<div className={styles.box}>{<Board fen={fen} setFen={setFen} />}</div>
			</div>
			<div className={styles.util}>
				<Util fen={fen} setFen={setFen} />
			</div>
		</div>
	)
}
