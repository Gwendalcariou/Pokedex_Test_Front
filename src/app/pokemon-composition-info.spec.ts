import { TestBed } from '@angular/core/testing';
import { PokemonCompositionInfo } from './pokemon-composition-info';

describe('PokemonCompositionInfo', () => {
  let service: PokemonCompositionInfo;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PokemonCompositionInfo],
    });
    service = TestBed.inject(PokemonCompositionInfo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit value when setValue is called', () => {
    let received: string | undefined;

    service.getValue().subscribe(v => {
      received = v as string;
    });

    service.setValue('25');

    expect(received).toBe('25');
  });
});
