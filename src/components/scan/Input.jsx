import { FiUploadCloud } from 'react-icons/fi'
import styles from './Input.module.css'
import { useRef, useState } from 'react'
import Loading from '../loading/Loading'

export default function Input({ image, setImage, upload, loading, error }) {
	const inputRef = useRef(null)

	function handleInput() {
		inputRef.current?.click()
	}

	function handleFileChange(event) {
		const file = event.target.files?.[0]

		if (!file) return

		const url = URL.createObjectURL(file)
		setImage(url)
		upload(file)
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
				{error && (
					<div className={styles.error}>
						<span className={styles.errorIcon}>⚠</span>
						<span>{error}</span>
					</div>
				)}
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
