import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, SimpleChange } from '@angular/core';
import { of, Subject, throwError } from 'rxjs';

import { Pokeinformations } from './pokeinformations';
import { PokeAPIService } from '../poke-apiservice';
import { PokemonCompositionInfo } from '../pokemon-composition-info';
import { PokemonInformations } from '../pokemon';

describe('Pokeinformations', () => {
  let component: Pokeinformations;
  let fixture: ComponentFixture<Pokeinformations>;

  let apiMock: {
    getPokemonSpecies: jest.Mock;
    getEvolutionChainByUrl: jest.Mock;
  };
  let compositionInfoMock: {
    getValue: jest.Mock;
  };
  let cdrMock: { markForCheck: jest.Mock };
  let bus$: Subject<string>;


  beforeEach(async () => {
    apiMock = {
      getPokemonSpecies: jest.fn().mockReturnValue(
        of({
          evolution_chain: {
            url: 'https://example.com/evolution-chain/1/',
          },
        }),
      ),
      getEvolutionChainByUrl: jest.fn().mockReturnValue(
        of({
          chain: {
            species: {
              name: 'bulbasaur',
              url: 'https://pokeapi.co/api/v2/pokemon-species/1/',
            },
            evolves_to: [
              {
                species: {
                  name: 'ivysaur',
                  url: 'https://pokeapi.co/api/v2/pokemon-species/2/',
                },
                evolves_to: [],
              },
            ],
          },
        }),
      ),
    };

    compositionInfoMock = {
      getValue: jest.fn().mockReturnValue(new Subject<string>()),
    };
    
    bus$ = new Subject<string>();

    compositionInfoMock = {
      getValue: jest.fn().mockReturnValue(bus$),
    };


    cdrMock = {
      markForCheck: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [Pokeinformations],
      providers: [
        { provide: PokeAPIService, useValue: apiMock },
        { provide: PokemonCompositionInfo, useValue: compositionInfoMock },
        { provide: ChangeDetectorRef, useValue: cdrMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Pokeinformations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load evolution chain when informations changes with an id', () => {
    const info = {
      id: 1,
    } as PokemonInformations;

    // Simuler un changement d’@Input
    component.informations = info;
    component.ngOnChanges({
      informations: new SimpleChange(null, info, true),
    });

    expect(apiMock.getPokemonSpecies).toHaveBeenCalledWith(1);
    expect(apiMock.getEvolutionChainByUrl).toHaveBeenCalledWith(
      'https://example.com/evolution-chain/1/',
    );

    const stages = (component as any).evolutionStages;

    // On s'attend à 2 étapes : bulbasaur puis ivysaur
    expect(stages.length).toBe(2);
    expect(stages[0][0].id).toBe(1);
    expect(stages[0][0].name).toBe('bulbasaur');
    expect(stages[1][0].id).toBe(2);
    expect(stages[1][0].name).toBe('ivysaur');

  });

    it('should log when composition info bus emits an id', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    bus$.next('25');

    expect(logSpy).toHaveBeenCalledWith('[bus] id =', '25');

    logSpy.mockRestore();
  });

    it('should handle species without evolution_chain url', () => {
    apiMock.getPokemonSpecies.mockReturnValueOnce(
      of({
        evolution_chain: null,
      }),
    );

    const info = { id: 1 } as PokemonInformations;
    component.informations = info;

    component.ngOnChanges({
      informations: new SimpleChange(null, info, true),
    });


    expect(apiMock.getEvolutionChainByUrl).not.toHaveBeenCalled();

    const stages = (component as any).evolutionStages;
    expect(stages).toEqual([]); // aucun niveau d’évolution
  });

    it('should clean up subscriptions on ngOnDestroy', () => {
    const destroy$ = (component as any).destroy$ as Subject<void>;
    const nextSpy = jest.spyOn(destroy$, 'next');
    const completeSpy = jest.spyOn(destroy$, 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });

    it('should handle errors when loading evolution chain', () => {
    // On force une erreur sur getPokemonSpecies pour activer catchError
    apiMock.getPokemonSpecies.mockReturnValueOnce(
      throwError(() => new Error('network error')),
    );

    const info = { id: 1 } as PokemonInformations;
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    component.informations = info;
    component.ngOnChanges({
      informations: new SimpleChange(null, info, false),
    });

    // L’erreur doit être loggée
    expect(errorSpy).toHaveBeenCalled();

    // Et aucune étape d’évolution ne doit être construite
    const stages = (component as any).evolutionStages;
    expect(stages).toEqual([]);

    errorSpy.mockRestore();
  });


});
