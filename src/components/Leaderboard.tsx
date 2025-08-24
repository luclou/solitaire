import React from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import styles from './Leaderboard.module.css';

export default function Leaderboard() {
  const { items, loading, error } = useLeaderboard();

  if (loading) {
    return <div className={styles.leaderboard}>Loading...</div>;
  }
  if (error) {
    return <div className={styles.leaderboard}>Error loading leaderboard</div>;
  }

  return (
    <div className={styles.leaderboard}>
      <h2>Leaderboard</h2>
      <ol className={styles.list}>
        {items.map((item, idx) => (
          <li key={idx}>
            {item.points} - {item.date}
          </li>
        ))}
      </ol>
    </div>
  );
}
