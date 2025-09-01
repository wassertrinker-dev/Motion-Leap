// in /src/player.test.ts
import { Player } from './player'; // Ohne .js ist hier sauberer
describe('Player', () => {
    it('sollte beim Springen eine negative vertikale Geschwindigkeit erhalten', () => {
        // ARRANGE
        // ÄNDERUNG HIER:
        const player = new Player(800, 600, 'dummy-path/player.png');
        player.velocityY = 0;
        // ACT
        player.jump();
        // ASSERT
        expect(player.velocityY).toBe(-20);
    });
    it('sollte nicht springen können, wenn er sich bereits in der Luft befindet', () => {
        // ARRANGE
        // ÄNDERUNG HIER:
        const player = new Player(800, 600, 'dummy-path/player.png');
        player.velocityY = 10;
        // ACT
        player.jump();
        // ASSERT
        expect(player.velocityY).toBe(10);
    });
});
