import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPokemonPipe',
  standalone: false,
  pure: false
})
export class FilterPokemonPipePipe implements PipeTransform {
/*
 * Pipe d’affichage : filtre une liste par une propriété et un terme de recherche.
 * - pokes: liste d’objets (ex: [{ id, name, url }, ...])
 * - property: le champ sur lequel on veut chercher (ex: 'name')
 * - searchString: le texte tapé par l’utilisateur
 */
  transform(pokes: any[], property?: string, searchString?: string): any {
    // Si aucun terme de recherche n’est défini (undefined),
    // on renvoie la liste entière sans la filtrer.
    if (typeof searchString == 'undefined') {  
      return pokes;
    }
    // Si aucun terme de recherche n’est défini (undefined),
    // on renvoie la liste entière sans la filtrer.
    else if (typeof pokes !== 'undefined' && typeof property !== 'undefined') {
      return pokes.filter((poke) => {
         // On compare les valeurs en minuscules pour éviter des problèmes de lecture.
        return poke[property].toLowerCase().indexOf(searchString.toLowerCase()) !== -1;
      });
      // Sinon (par exemple si pokes ou property manquent), on renvoie une liste vide.
    } else {
      return [];
    }
  }

}
