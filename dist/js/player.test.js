// in /src/player.test.ts
// Zuerst versuchen wir den problematischen Import
import { Player } from './player';
// Direkt danach loggen wir, WAS wir importiert haben.
// Wenn der Import fehlschlägt, wird diese Zeile nie erreicht.
console.log('--- DEBUG: Import von Player in player.test.ts ---');
console.log(Player);
console.log('------------------------------------------------');
// Test 1: Ein Test, der IMMER funktioniert, um zu sehen, ob Jest überhaupt so weit kommt.
test('Ein einfacher Test in der Player-Test-Datei, der immer bestehen sollte', () => {
    expect(true).toBe(true);
});
// Test 2: Unsere eigentlichen Tests
describe('Player', () => {
    it('sollte beim Springen eine negative vertikale Geschwindigkeit erhalten', () => {
        const player = new Player(800, 600);
        player.velocityY = 0;
        player.jump();
        expect(player.velocityY).toBe(-20);
    });
    it('sollte nicht springen können, wenn er sich bereits in der Luft befindet', () => {
        const player = new Player(800, 600);
        player.velocityY = 10;
        player.jump();
        expect(player.velocityY).toBe(10);
    });
});
