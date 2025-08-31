// in /src/simple.test.ts

// Ein simpler Test, der immer wahr sein muss
test('sollte 1 + 1 korrekt zu 2 addieren', () => {
    expect(1 + 1).toBe(2);
});

// Ein weiterer Test, um sicherzugehen
it('sollte bestätigen, dass true wahr ist', () => {
    expect(true).toBe(true);
});