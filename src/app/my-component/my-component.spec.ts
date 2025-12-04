import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { of, Subject } from 'rxjs';

import { MyComponent } from './my-component';
import { PokeAPIService } from '../poke-apiservice';
import { PokemonCompositionInfo } from '../pokemon-composition-info';
import { PokemonInformations } from '../pokemon';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  let pokeApiServiceMock: {
    getPokemon: jest.Mock;
    getPokemonInfo: jest.Mock;
  };
  let compositionInfoMock: {
    setValue: jest.Mock;
    getValue: jest.Mock;
  };
  let cdrMock: { detectChanges: jest.Mock };

  const dummyPokemonInfo: PokemonInformations = {
    id: 25,
    name: 'pikachu',
    abilities: [] as any,
    base_experience: 0,
    cries: {} as any,
    forms: [] as any,
    game_indices: [] as any,
    height: 4,
    held_items: [],
    is_default: true,
    location_area_encounters: '',
    moves: [] as any,
    order: 25,
    past_abilities: [] as any,
    past_types: [],
    species: {} as any,
    sprites: {} as any,
    stats: [] as any,
    types: [] as any,
    weight: 60,
  };

  beforeEach(async () => {
    pokeApiServiceMock = {
      getPokemon: jest.fn().mockReturnValue(
        of({
          results: [
            {
              name: 'bulbasaur',
              url: 'https://pokeapi.co/api/v2/pokemon/1/',
            },
          ],
        }),
      ),
      getPokemonInfo: jest.fn().mockReturnValue(of(dummyPokemonInfo)),
    };

    compositionInfoMock = {
      setValue: jest.fn(),
      getValue: jest.fn().mockReturnValue(new Subject<string>()),
    };

    cdrMock = {
      detectChanges: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [MyComponent],
      providers: [
        { provide: PokeAPIService, useValue: pokeApiServiceMock },
        { provide: PokemonCompositionInfo, useValue: compositionInfoMock },
        { provide: ChangeDetectorRef, useValue: cdrMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pokemons on ngOnInit', () => {
    // ngOnInit est déjà appelé lors du premier detectChanges
    const pokemons = (component as any).pokemons;

    expect(pokeApiServiceMock.getPokemon).toHaveBeenCalled();
    expect(pokemons.length).toBe(1);
    expect(pokemons[0].id).toBe(1);
    expect(pokemons[0].name).toBe('bulbasaur');
  });

  it('go() should call getPokemonInfo and update pokeInformations', () => {
    (component as any).selectedId = '25';

    (component as any).go();

    expect(pokeApiServiceMock.getPokemonInfo).toHaveBeenCalledWith('25');
    expect((component as any).pokeInformations).toEqual(dummyPokemonInfo);
    expect(compositionInfoMock.setValue).toHaveBeenCalledWith('25');
    expect(cdrMock.detectChanges).toHaveBeenCalled();
  });

  it('go() should do nothing if selectedId is null', () => {
    (component as any).selectedId = null;

    (component as any).go();

    expect(pokeApiServiceMock.getPokemonInfo).not.toHaveBeenCalled();
  });
});
