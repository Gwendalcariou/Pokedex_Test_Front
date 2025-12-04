import { Pokemon } from './pokemon';

describe('Pokemon', () => {
  it('should create an instance with given id, name and url', () => {
    const p = new Pokemon(1, 'bulbasaur', 'https://pokeapi.co/api/v2/pokemon/1/');

    expect(p).toBeTruthy();
    expect(p.id).toBe(1);
    expect(p.name).toBe('bulbasaur');
    expect(p.url).toContain('/pokemon/1/');
  });
});
