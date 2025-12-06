import { FilterPokemonPipePipe } from './filter-pokemon--pipe-pipe';

describe('FilterPokemonPipePipe', () => {
  let pipe: FilterPokemonPipePipe;

  beforeEach(() => {
    pipe = new FilterPokemonPipePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return original array when searchString is undefined', () => {
    const pokes = [
      { name: 'pikachu' },
      { name: 'bulbasaur' },
    ];

    const result = pipe.transform(pokes, 'name', undefined);

    expect(result).toBe(pokes);
  });

  it('should filter list when pokes and property are defined', () => {
    const pokes = [
      { name: 'pikachu' },
      { name: 'bulbasaur' },
    ];

    const result = pipe.transform(pokes, 'name', 'saur');

    expect(result).toEqual([{ name: 'bulbasaur' }]);
  });

  it('should return [] when pokes or property are undefined', () => {
    // @ts-expect-error
    const result = pipe.transform(undefined, 'name', 'pika');

    expect(result).toEqual([]);
  });
});
