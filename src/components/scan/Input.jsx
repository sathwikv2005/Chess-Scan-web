import { FiUploadCloud } from 'react-icons/fi'
import styles from './Input.module.css'
import { useEffect, useRef, useState } from 'react'
import Loading from '../loading/Loading'

export default function Input({ image, setImage, upload, loading, error }) {
	const inputRef = useRef(null)
	const dropRef = useRef(null)
	const [isDragging, setIsDragging] = useState(false)

	function handleInput() {
		inputRef.current?.click()
	}

	function processFile(file) {
		if (!file || !file.type.startsWith('image/')) return

		const url = URL.createObjectURL(file)
		setImage(url)
		upload(file)
	}

	function handleFileChange(event) {
		const file = event.target.files?.[0]
		processFile(file)
	}

	function handleDragOver(event) {
		event.preventDefault()
		setIsDragging(true)
	}

	function handleDragLeave(event) {
		event.preventDefault()
		setIsDragging(false)
	}

	function handleDrop(event) {
		event.preventDefault()
		setIsDragging(false)

		const file = event.dataTransfer.files?.[0]
		processFile(file)
	}

	useEffect(() => {
		function handlePaste(event) {
			const items = event.clipboardData?.items

			if (!items) return

			for (const item of items) {
				if (item.type.startsWith('image/')) {
					const file = item.getAsFile()
					processFile(file)
					break
				}
			}
		}

		window.addEventListener('paste', handlePaste)

		return () => {
			window.removeEventListener('paste', handlePaste)
		}
	}, [])

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

			<div
				ref={dropRef}
				className={`${styles.inputBox} ${isDragging ? styles.dragging : ''}`}
				onClick={handleInput}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
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
			<div className={styles.text}>Upload, drag & drop, or paste a chess position</div>
		</>
	)
}

function Image({ image }) {
	return <img src={image} className={styles.image} alt="Uploaded chess position" />
}
