import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PokemonInformations, PokemonServiceResult } from './pokemon';

@Injectable({
  providedIn: 'root' // Rend le service disponible dans toute l’application
})
export class PokeAPIService {

  // URL de base de l’API Pokémon.
  // -> "readonly" signifie qu’on ne peut pas la modifier plus tard.
  private readonly url = 'https://pokeapi.co/api/v2/pokemon/';

  // On injecte HttpClient via le constructeur.
  // C’est lui qui s’occupe d’effectuer les requêtes HTTP (GET, POST, PUT, etc.)
  constructor(private http: HttpClient) {

  }

  /*
   * Récupère la liste de base des Pokémon (nom + URL).
   * 
   * La méthode renvoie un "Observable", c’est-à-dire un flux de données asynchrones.
   * On devra donc s’abonner (.subscribe()) pour déclencher la requête et recevoir les données.
   */
  getPokemon(limit: number = 10000, offset: number = 0) {
    return this.http.get<PokemonServiceResult>(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
  }


  /*
   * Récupère les informations détaillées d’un Pokémon spécifique
   * (nom, capacités, sprites, etc.) à partir de son id.
   * 
   * @param id Identifiant du Pokémon (ex: "1" pour Bulbasaur)
   * 
   * La méthode renvoie un "Observable", c’est-à-dire un flux de données asynchrones.
   * On devra donc s’abonner (.subscribe()) pour déclencher la requête et recevoir les données.
   */
  getPokemonInfo(id: String): Observable<PokemonInformations> {
    // Concaténation de l’URL de base avec l’ID, suivi d’un slash.
    // Exemple : https://pokeapi.co/api/v2/pokemon/1/
    return this.http.get<PokemonInformations>(this.url + id + '/');
  }



  getPokemonSpecies(id: string | number): Observable<any> {
    return this.http.get<any>(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
  }

  getEvolutionChainByUrl(url: string): Observable<any> {
    // L’URL est fournie par /pokemon-species/
    return this.http.get<any>(url);
  }

}
