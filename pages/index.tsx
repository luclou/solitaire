import { useEffect, useState } from 'react';
import GameBoard from '../src/components/GameBoard';
import {
  Game,
  Card,
  Pile,
  Command,
  CommandService,
  HintService,
  MovesService,
  AudioService,
  DrawCardCommandFactory,
  MoveCardCommandFactory,
  RefillStockCommandFactory,
} from '../src/game/Game';
import { BehaviorSubject } from 'rxjs';

// Simple in-memory implementations of the services and commands that the
// `Game` class requires. These are intentionally minimal and only implement the
// pieces that are used by the draw card flow.
class BasicCommand implements Command {
  constructor(private fn: () => void) {}
  execute() {
    this.fn();
  }
}

class PileImpl implements Pile {
  public cards: Card[] = [];
  public cards$ = new BehaviorSubject<Card[]>([]);
  get hasCards() {
    return this.cards.length > 0;
  }
}

class CardImpl implements Card {
  constructor(public pile: Pile) {}
}

class DrawCardFactory implements DrawCardCommandFactory {
  create(stock: Pile, waste: Pile): Command {
    return new BasicCommand(() => {
      const s = stock as PileImpl;
      const w = waste as PileImpl;
      const card = s.cards.pop();
      if (card) {
        card.pile = w;
        w.cards.push(card);
        s.cards$.next([...s.cards]);
        w.cards$.next([...w.cards]);
      }
    });
  }
}

class MoveCardFactory implements MoveCardCommandFactory {
  create(card: Card, from: Pile, to: Pile): Command {
    return new BasicCommand(() => {
      const f = from as PileImpl;
      const t = to as PileImpl;
      const index = f.cards.indexOf(card);
      if (index >= 0) {
        f.cards.splice(index, 1);
        t.cards.push(card);
        card.pile = t;
        f.cards$.next([...f.cards]);
        t.cards$.next([...t.cards]);
      }
    });
  }
}

class RefillStockFactory implements RefillStockCommandFactory {
  create(stock: Pile, waste: Pile): Command {
    return new BasicCommand(() => {
      const s = stock as PileImpl;
      const w = waste as PileImpl;
      while (w.cards.length) {
        const card = w.cards.pop()!;
        card.pile = s;
        s.cards.push(card);
      }
      s.cards$.next([...s.cards]);
      w.cards$.next([...w.cards]);
    });
  }
}

const audioService: AudioService = { playSfx: () => {} };
const commandService: CommandService = { add: () => {} };
const hintService: HintService = { findValidMove: () => null };
const movesService: MovesService = { increment: () => {} };

export default function Home() {
  // Create the game instance once.
  const [game] = useState(() => {
    const instance = new Game(
      audioService,
      commandService,
      hintService,
      movesService,
      new DrawCardFactory(),
      new MoveCardFactory(),
      new RefillStockFactory()
    );

    const pileStock = new PileImpl();
    const pileWaste = new PileImpl();

    // Populate the stock pile with a few cards so drawing is visible.
    for (let i = 0; i < 5; i++) {
      pileStock.cards.push(new CardImpl(pileStock));
    }
    pileStock.cards$.next([...pileStock.cards]);

    instance.init(pileStock, pileWaste, [], []);
    return instance;
  });

  const pileStock = game.pileStock as PileImpl;
  const pileWaste = game.pileWaste as PileImpl;

  const [stockCount, setStockCount] = useState(pileStock.cards.length);
  const [wasteCount, setWasteCount] = useState(pileWaste.cards.length);

  // Subscribe to pile changes so UI updates whenever the game state changes.
  useEffect(() => {
    const sub1 = pileStock.cards$.subscribe((c) => setStockCount(c.length));
    const sub2 = pileWaste.cards$.subscribe((c) => setWasteCount(c.length));
    return () => {
      sub1.unsubscribe();
      sub2.unsubscribe();
    };
  }, [pileStock, pileWaste]);

  return (
    <div>
      <GameBoard game={game} />
      <div>
        Stock: {stockCount} | Waste: {wasteCount}
      </div>
    </div>
  );
}

