import { FiUploadCloud } from 'react-icons/fi'
import styles from './Input.module.css'
import { useRef, useState } from 'react'
import Loading from '../loading/Loading'

export default function Input({ image, setImage }) {
	const [loading, setLoading] = useState(false)

	const inputRef = useRef(null)

	function handleInput() {
		inputRef.current?.click()
	}

	function handleFileChange(event) {
		const file = event.target.files?.[0]

		if (!file) return

		const url = URL.createObjectURL(file)
		setImage(url)
	}

	if (loading) return <Loading />

	return (
		<>
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				style={{ display: 'none' }}
				onChange={handleFileChange}
			/>

			<div className={styles.inputBox} onClick={handleInput}>
				{image ? <Image image={image} /> : <Default />}
			</div>
		</>
	)
}

function Default() {
	return (
		<>
			<FiUploadCloud className={styles.icon} />
			<div className={styles.text}>Upload chess position</div>
		</>
	)
}

function Image({ image }) {
	return <img src={image} className={styles.image} alt="Uploaded chess position" />
}
