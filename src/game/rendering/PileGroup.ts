import Phaser from 'phaser';
import { CardSprite } from './CardSprite';

/**
 * Represents a pile of cards. Mirrors Unity's hierarchy by grouping card sprites.
 */
export class PileGroup extends Phaser.GameObjects.Group {
    constructor(scene: Phaser.Scene, children?: CardSprite[]) {
        super(scene);
        if (children) {
            children.forEach((c) => this.add(c));
        }
    }

    /**
     * Adds a card to the pile and triggers a layout animation.
     */
    addCard(card: CardSprite): void {
        this.add(card);
        this.layout();
    }

    /**
     * Layout cards with a small offset, animating using tweens.
     */
    layout(): void {
        this.getChildren().forEach((child, index) => {
            const card = child as CardSprite;
            card.moveTo(card.x, index * 30);
        });
    }
}
