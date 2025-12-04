import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { PokemonInformations } from '../pokemon';
import { PokemonCompositionInfo } from '../pokemon-composition-info';
import { Subject, switchMap, takeUntil, catchError, of } from 'rxjs';
import { PokeAPIService } from '../poke-apiservice';

@Component({
  selector: 'app-pokeinformations',
  standalone: false,
  templateUrl: './pokeinformations.html',
  styleUrls: ['./pokeinformations.css'],
  providers: []
})
export class Pokeinformations {
  @Input('informations') informations: PokemonInformations | undefined;

  evolutionStages: Array<Array<{ id: number; name: string; sprite: string }>> = [];
  private destroy$ = new Subject<void>();

  constructor(
    private pokemonCompositionInfo: PokemonCompositionInfo,
    private api: PokeAPIService,
    private cdr: ChangeDetectorRef
  ) {
    this.pokemonCompositionInfo.getValue().subscribe(e => console.log('[bus] id =', e));
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['informations'] && this.informations?.id) {
      console.log('[evo] ngOnChanges id =', this.informations.id);

      this.evolutionStages = [];
      this.cdr.markForCheck?.();

      this.loadEvolutionChain(this.informations.id);
    }
  }

  private loadEvolutionChain(pokemonId: number | string) {
    console.log('[evo] loadEvolutionChain(', pokemonId, ')');

    this.api.getPokemonSpecies(pokemonId)
      .pipe(
        switchMap((species: any) => {
          const url = species?.evolution_chain?.url as string | undefined;
          console.log('[evo] species.evolution_chain.url =', url);
          return url ? this.api.getEvolutionChainByUrl(url) : of(null);
        }),
        catchError(err => { console.error('[evo] error', err); return of(null); }),
        takeUntil(this.destroy$)
      )
      .subscribe((chain: any) => {
        const root = chain?.chain;
        this.evolutionStages = this.buildStages(root);
        console.log('[evo] stages =', this.evolutionStages);
        this.cdr.markForCheck?.();
      });
  }

  private buildStages(root: any): Array<Array<{ id: number; name: string; sprite: string }>> {
    if (!root) return [];
    const stages: Array<Array<{ id: number; name: string; sprite: string }>> = [];
    let currentLevel: any[] = [root];

    while (currentLevel.length) {
      const stage = currentLevel.map(node => {
        const name: string = node?.species?.name ?? 'unknown';
        const id = this.idFromSpeciesUrl(node?.species?.url ?? '');
        return { id, name, sprite: this.officialArtwork(id) };
      });
      stages.push(stage);
      currentLevel = currentLevel.flatMap(n => n?.evolves_to ?? []);
    }
    return stages;
  }

  private idFromSpeciesUrl(url: string): number {
    return Number(url.split('/').filter(Boolean).pop());
  }

  private officialArtwork(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
