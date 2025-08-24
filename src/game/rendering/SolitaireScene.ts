import Phaser from 'phaser';
import { Card } from '../Game';
import { CardSprite } from './CardSprite';
import { PileGroup } from './PileGroup';

/**
 * Main scene responsible for rendering piles and cards using Phaser groups.
 */
export class SolitaireScene extends Phaser.Scene {
    pileStock!: PileGroup;
    pileWaste!: PileGroup;
    pileFoundations!: PileGroup[];
    pileTableaus!: PileGroup[];

    constructor() {
        super({ key: 'SolitaireScene' });
    }

    create(): void {
        this.pileStock = new PileGroup(this);
        this.pileWaste = new PileGroup(this);

        this.pileFoundations = [];
        for (let i = 0; i < 4; i++) {
            const foundation = new PileGroup(this);
            this.pileFoundations.push(foundation);
        }

        this.pileTableaus = [];
        for (let i = 0; i < 7; i++) {
            const tableau = new PileGroup(this);
            this.pileTableaus.push(tableau);
        }
    }

    /**
     * Creates a card sprite and adds it to a pile.
     */
    addCardToPile(card: Card, pile: PileGroup, texture: string): CardSprite {
        const sprite = new CardSprite(this, card, texture);
        pile.addCard(sprite);
        return sprite;
    }
}
