import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { PokeAPIService } from './poke-apiservice';
import { PokemonInformations, PokemonServiceResult } from './pokemon';

describe('PokeAPIService', () => {
  let service: PokeAPIService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokeAPIService],
    });

    service = TestBed.inject(PokeAPIService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // vérifie qu’il ne reste pas de requêtes en attente
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the correct URL for getPokemon', () => {
    const dummyResponse: PokemonServiceResult = {
      count: 2,
      next: '',
      previous: '',
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      ],
    };

    let received: PokemonServiceResult | undefined;

    service.getPokemon(10, 20).subscribe(res => {
      received = res;
    });

    const req = httpMock.expectOne(
      'https://pokeapi.co/api/v2/pokemon?limit=10&offset=20',
    );
    expect(req.request.method).toBe('GET');

    req.flush(dummyResponse);

    expect(received).toEqual(dummyResponse);
  });

  it('should call the correct URL for getPokemonInfo', () => {
    const dummyInfo: PokemonInformations = {
      // on ne garde que ce qui est nécessaire, le reste casté
      id: 1,
      name: 'bulbasaur',
      abilities: [] as any,
      base_experience: 0,
      cries: {} as any,
      forms: [] as any,
      game_indices: [] as any,
      height: 7,
      held_items: [],
      is_default: true,
      location_area_encounters: '',
      moves: [] as any,
      order: 1,
      past_abilities: [] as any,
      past_types: [],
      species: {} as any,
      sprites: {} as any,
      stats: [] as any,
      types: [] as any,
      weight: 69,
    };

    let received: PokemonInformations | undefined;

    service.getPokemonInfo('1').subscribe(info => {
      received = info;
    });

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/1/');
    expect(req.request.method).toBe('GET');

    req.flush(dummyInfo);

    expect(received?.id).toBe(1);
    expect(received?.name).toBe('bulbasaur');
  });

  it('should call correct URL for getPokemonSpecies', () => {
    let received: any;

    service.getPokemonSpecies(1).subscribe(res => {
      received = res;
    });

    const req = httpMock.expectOne(
      'https://pokeapi.co/api/v2/pokemon-species/1/',
    );
    expect(req.request.method).toBe('GET');

    req.flush({ foo: 'bar' });

    expect(received).toEqual({ foo: 'bar' });
  });

  it('should call provided URL for getEvolutionChainByUrl', () => {
    const url = 'https://example.com/evolution-chain/1/';
    let received: any;

    service.getEvolutionChainByUrl(url).subscribe(res => {
      received = res;
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');

    req.flush({ chain: {} });

    expect(received).toEqual({ chain: {} });
  });
});
