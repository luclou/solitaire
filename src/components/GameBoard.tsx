import React, { useRef, useState } from 'react';
import { Game } from '../game/Game';
import ControlButtons from './ControlButtons';
import Popup from './Popup';
import Leaderboard from './Leaderboard';
import styles from './GameBoard.module.css';

interface Props {
  game: Game;
}

export default function GameBoard({ game }: Props) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <div className={styles.gameBoard}>
      <div ref={boardRef} className={styles.board} />
      <div className={styles.sidebar}>
        <ControlButtons game={game} onShowLeaderboard={() => setShowLeaderboard(true)} />
      </div>
      <Popup open={showLeaderboard} onClose={() => setShowLeaderboard(false)}>
        <Leaderboard />
      </Popup>
    </div>
  );
}
