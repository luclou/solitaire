import Phaser from 'phaser';
import { Tween, Easing, update } from '@tweenjs/tween.js';

let ticking = false;

/**
 * Creates a tween using tween.js to mimic DOTween easing.
 */
export function tweenTo(
    scene: Phaser.Scene,
    target: any,
    { x, y, duration = 300, ease = Easing.Quadratic.Out, yoyo = false }: {
        x?: number;
        y?: number;
        duration?: number;
        ease?: (amount: number) => number;
        yoyo?: boolean;
    }
): Promise<void> {
    return new Promise((resolve) => {
        const to: any = {};
        if (typeof x === 'number') to.x = x;
        if (typeof y === 'number') to.y = y;

        const tween = new Tween(target)
            .to(to, duration)
            .easing(ease)
            .onComplete(() => resolve())
            .start();

        if (yoyo) {
            tween.yoyo(true);
            tween.repeat(1);
        }

        if (!ticking) {
            scene.events.on('update', () => update());
            ticking = true;
        }
    });
}
