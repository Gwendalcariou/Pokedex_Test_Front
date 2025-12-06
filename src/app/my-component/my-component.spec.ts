import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { MyComponent } from './my-component';
import { PokeAPIService } from '../poke-apiservice';
import { PokemonCompositionInfo } from '../pokemon-composition-info';
import { PokemonInformations } from '../pokemon';
import { FilterPokemonPipePipe } from '../filter-pokemon--pipe-pipe';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


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
    // Mocks
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
      declarations: [
        MyComponent,
        FilterPokemonPipePipe, // pipe utilisé dans le template
      ],
      imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
      ],
      providers: [
        { provide: PokemonCompositionInfo, useValue: compositionInfoMock },
        { provide: ChangeDetectorRef, useValue: cdrMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(MyComponent, {
        set: {
          providers: [
            { provide: PokeAPIService, useValue: pokeApiServiceMock },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pokemons on ngOnInit', () => {
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
  });

  it('go() should do nothing if selectedId is null', () => {
    (component as any).selectedId = null;

    (component as any).go();

    expect(pokeApiServiceMock.getPokemonInfo).not.toHaveBeenCalled();
  });

    it('trackById should return the pokemon id', () => {
    const result = (component as any).trackById(0, { id: 42 });
    expect(result).toBe(42);
  });

  it('getIdFromUrl should extract numeric id from url', () => {
    const id = (component as any)['getIdFromUrl'](
      'https://pokeapi.co/api/v2/pokemon/123/',
    );
    expect(id).toBe(123);
  });

});
