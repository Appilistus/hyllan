import { Link } from "react-router-dom"
import styles from "./ProductDetail.module.css";


function NotFound () {
  return (
    <>
      <Link to="/" className={styles.back}>
        ← Tillbaka till startsidan
      </Link>
      <h1>Sidan hittades inte... 💔</h1>
    </>
  )
}

export default NotFound
