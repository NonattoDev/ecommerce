import { useState } from "react";
import Link from "next/link";
import styles from "./sidebar.module.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.sidebar__toggle} onClick={toggleSidebar}>
        <div className={styles.sidebar__toggleIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path
              fillRule="evenodd"
              d="M15.97 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 11-1.06-1.06l3.22-3.22H7.5a.75.75 0 010-1.5h11.69l-3.22-3.22a.75.75 0 010-1.06zm-7.94 9a.75.75 0 010 1.06l-3.22 3.22H16.5a.75.75 0 010 1.5H4.81l3.22 3.22a.75.75 0 11-1.06 1.06l-4.5-4.5a.75.75 0 010-1.06l4.5-4.5a.75.75 0 011.06 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <div className={styles.sidebar__content}>
        <ul className={styles.sidebar__menu}>
          <li className={styles.sidebar__menuItem}>
            <Link href="/">Home</Link>
          </li>
          <li className={styles.sidebar__menuItem}>
            <Link href="/about">About</Link>
          </li>
          <li className={styles.sidebar__menuItem}>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
