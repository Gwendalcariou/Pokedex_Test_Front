import { ChangeDetectorRef, Component } from '@angular/core';
import { Pokemon, PokemonInformations } from '../pokemon';
import { PokeAPIService } from '../poke-apiservice';
//import { Observable } from 'rxjs';
import { PokemonCompositionInfo } from '../pokemon-composition-info';

@Component({
  selector: 'app-my-component',
  standalone: false,
  templateUrl: './my-component.html',
  styleUrl: './my-component.css',
  providers: [PokeAPIService]        // Fournit une instance du service à ce composant et ses enfants
})
export class MyComponent {
  // Champs liés à ce template via [(ngModel)]
  protected id: string = '';
  protected selectedId: string = '';       // id du Pokémon sélectionné
  protected searchName: string = '';       // terme de recherche saisi par l'utilisateur

  // Données détaillées du Pokémon affichées dans <app-pokeinformations>
  protected pokeInformations: PokemonInformations | undefined;

  // Liste des Pokémons récupérée via l'API au chargement
  pokemons: Pokemon[] = [];

  trackById = (_: number, p: { id: string | number }) => p.id;


  // Le constructeur sert à l'injection de dépendances (services)
  // - pokeService : fait les requêtes HTTP à la PokéAPI
  // - cdr : utilitaire Angular pour forcer une détection de changements manuelle (bug avec mon code qui a necessité de l'utiliser)
  // - pokemonCompositionInfo : composition d'informations pour partager l'id sélectionné
  constructor(
    private pokeService: PokeAPIService,
    private cdr: ChangeDetectorRef,
    private pokemonCompositionInfo: PokemonCompositionInfo
  ) { }

  /*
   * Appelé quand on clique sur "GO".
   * 1) On s'assure qu'un id est bien présent.
   * 2) On appelle l'API pour récupérer les infos du Pokémon sélectionné.
   * 3) On stocke ces infos dans 'pokeInformations' (le template se mettra à jour).
   * 4) On émet l'id via 'pokemonCompositionInfo' pour que d'autres composants (enfant) puissent réagir.
   */
  go() {
    if (this.selectedId != null) {
      this.pokeService.getPokemonInfo(this.selectedId).subscribe(data => {
        this.pokeInformations = data;
        // Correction d'un bug d'affichage (le template ne se rafraîchissait avec du délai).
        this.cdr.detectChanges();
        this.pokemonCompositionInfo.setValue(this.selectedId);
      });
    }
  }

  // Petit utilitaire : extrait l'id depuis une URL ".../pokemon/5/" -> 5
  private getIdFromUrl(url: string): number {
    return Number(url.split('/').filter(Boolean).pop());
  }

  /*
   * Cycle de vie Angular : appelé une fois quand le composant s'initialise.
   * On en profite pour charger la liste des pokémons (noms + URLs) via l'API.
   */
  ngOnInit(): void {
    this.pokeService.getPokemon(10000, 0).subscribe((data: any) => {
      const res = data.results as Array<{ name: string; url: string }>;

      // On fabrique la liste locale de Pokémons à partir de la réponse API.
      // NB : on extrait le "vrai" id depuis l'URL (PokeAPI commence à 1, pas 0).
      this.pokemons = res.map(e => new Pokemon(this.getIdFromUrl(e.url), e.name, e.url));
    });
  }
}
