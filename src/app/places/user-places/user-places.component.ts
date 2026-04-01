import { Component, DestroyRef, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {
  private placesService = inject(PlacesService);
  places = this.placesService.loadedUserPlaces;

  private destroyRef = inject(DestroyRef);

  isLoading = signal(true);
  // error signal, initial value is an empty string
  error = signal('');

  // On initialzation of the component, we fetch the available places from the backend
  ngOnInit() {
    this.isLoading.set(true);
    const subscription = this.placesService.loadUserPlaces().subscribe({
      error: (error: Error) => {
        this.error.set(error.message);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // This method should delete place from user places in backend and update the list of user places in the UI
  onSelectPlace($event: Place) {
    const subscription = this.placesService.removeUserPlace($event).subscribe();
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
