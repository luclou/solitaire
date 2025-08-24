import React from 'react';
import { Game } from '../game/Game';
import styles from './GameBoard.module.css';

interface Props {
  game: Game & {
    undo?: () => void;
    hint?: () => void;
  };
  onShowLeaderboard?: () => void;
}

export default function ControlButtons({ game, onShowLeaderboard }: Props) {
  return (
    <div className={styles.controls}>
      <button onClick={() => game.drawCard()}>Draw</button>
      <button onClick={() => game.undo?.()}>Undo</button>
      <button onClick={() => game.hint?.()}>Hint</button>
      {onShowLeaderboard && (
        <button onClick={onShowLeaderboard}>Leaderboard</button>
      )}
    </div>
  );
}
