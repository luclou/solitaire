import GameBoard from '../src/components/GameBoard';

export default function Home() {
  const mockGame = {
    drawCard: () => {},
    undo: () => {},
    hint: () => {},
  } as any;

  return <GameBoard game={mockGame} />;
}
