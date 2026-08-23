import styles from './user-image.module.css'

export function UserImage({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} className={styles.userImage} />
}
