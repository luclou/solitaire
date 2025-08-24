import Phaser from 'phaser';
import { Card } from '../Game';
import { tweenTo } from './TweenHelper';

/**
 * Visual representation of a card.
 * Mirrors Unity's card prefab using a Phaser container.
 */
export class CardSprite extends Phaser.GameObjects.Container {
    public readonly card: Card;
    private sprite: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, card: Card, texture: string, frame?: string | number) {
        super(scene);
        this.card = card;
        this.sprite = scene.add.sprite(0, 0, texture, frame);
        this.add(this.sprite);
        scene.add.existing(this);
    }

    /**
     * Tween the card to a new position using easing similar to DOTween.
     */
    moveTo(x: number, y: number): Promise<void> {
        return tweenTo(this.scene, this, { x, y, duration: 300 });
    }

    /**
     * Flip animation to reveal or hide the card's face.
     */
    flip(): Promise<void> {
        return tweenTo(this.scene, this.sprite, {
            scaleX: 0,
            duration: 100,
            yoyo: true,
            ease: Phaser.Math.Easing.Sine.InOut,
        });
    }
}
