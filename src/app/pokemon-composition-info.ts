import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root' // Rend le service disponible dans toute l’application
})
export class PokemonCompositionInfo {

  constructor () {

  }

// Subject = “canal d’événements” : on next(id) d’un côté, on subscribe de l’autre.
  public stringVal: Subject<String> = new Subject<String>();

/* Émettre une nouvelle valeur (id du Pokémon sélectionné) */
  public setValue(stringVar: String) {
    this.stringVal.next(stringVar);
  }

/* S’abonner aux valeurs (côté lecteurs) */
  getValue() : Subject<String>{
    return this.stringVal;
  }
}
