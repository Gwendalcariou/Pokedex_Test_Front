import { TestBed } from '@angular/core/testing';

import { PokemonCompositionInfo } from './pokemon-composition-info';

describe('PokemonCompositionInfo', () => {
  let service: PokemonCompositionInfo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonCompositionInfo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
