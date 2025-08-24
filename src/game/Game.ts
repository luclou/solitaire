import { BehaviorSubject, Subject } from 'rxjs';

export enum Popup {
    None,
    Match,
    Options,
    Leaderboard,
}

export enum State {
    Home,
    Dealing,
    Playing,
    Paused,
    Win,
}

export interface Pile {
    hasCards: boolean;
}

export interface Card {
    pile: Pile;
}

export interface Command {
    execute(): void;
}

export interface CommandService {
    add(command: Command): void;
}

export interface RefillStockCommandFactory {
    create(stock: Pile, waste: Pile): Command;
}

export interface MoveCardCommandFactory {
    create(card: Card, from: Pile, to: Pile): Command;
}

export interface DrawCardCommandFactory {
    create(stock: Pile, waste: Pile): Command;
}

export interface HintService {
    findValidMove(card: Card): Pile | null;
}

export interface MovesService {
    increment(): void;
}

export interface AudioService {
    playSfx(key: string, volume: number): void;
}

export class Game {
    public hasStarted = new BehaviorSubject<boolean>(false);

    public restartCommand = new Subject<void>();
    public newMatchCommand = new Subject<void>();
    public continueCommand = new Subject<void>();

    public pileStock!: Pile;
    public pileWaste!: Pile;
    public pileFoundations!: Pile[];
    public pileTableaus!: Pile[];
    public cards!: Card[];

    constructor(
        private audioService: AudioService,
        private commandService: CommandService,
        private hintService: HintService,
        private movesService: MovesService,
        private drawCardCommandFactory: DrawCardCommandFactory,
        private moveCardCommandFactory: MoveCardCommandFactory,
        private refillStockCommandFactory: RefillStockCommandFactory
    ) {
        this.restartCommand.subscribe(() => this.restart());
        this.newMatchCommand.subscribe(() => this.newMatch());
        this.continueCommand.subscribe(() => this.continue());
    }

    public init(
        pileStock: Pile,
        pileWaste: Pile,
        pileFoundations: Pile[],
        pileTableaus: Pile[],
    ): void {
        this.pileStock = pileStock;
        this.pileWaste = pileWaste;
        this.pileFoundations = pileFoundations;
        this.pileTableaus = pileTableaus;

        this.spawnCards();
        this.loadLeaderboard();
    }

    public refillStock(): void {
        if (this.pileStock.hasCards || !this.pileWaste.hasCards) {
            this.playErrorSfx();
            return;
        }

        const command = this.refillStockCommandFactory.create(this.pileStock, this.pileWaste);
        command.execute();
        this.commandService.add(command);
        this.movesService.increment();
    }

    public moveCard(card: Card | null, pile?: Pile | null): void {
        if (!card) {
            return;
        }

        if (!pile) {
            pile = this.hintService.findValidMove(card);
        }

        if (!pile) {
            this.playErrorSfx();
            return;
        }

        const command = this.moveCardCommandFactory.create(card, card.pile, pile);
        command.execute();
        this.commandService.add(command);
        this.movesService.increment();
    }

    public drawCard(): void {
        const command = this.drawCardCommandFactory.create(this.pileStock, this.pileWaste);
        command.execute();
        this.commandService.add(command);
        this.movesService.increment();
    }

    private playErrorSfx(): void {
        this.audioService.playSfx('error', 0.5);
    }

    // Stubbed methods for completeness
    private spawnCards(): void {}
    private loadLeaderboard(): void {}
    private restart(): void {}
    private newMatch(): void {}
    private continue(): void {}
}

