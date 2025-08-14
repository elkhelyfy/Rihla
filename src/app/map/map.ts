// map.component.ts
import { Component, signal } from '@angular/core';
import type { LngLatLike, Map as MapboxMap, MapMouseEvent } from 'mapbox-gl';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.html',
  styleUrl: './map.css'
})
export class Map {
  movingMethod: 'jumpTo' | 'easeTo' | 'flyTo' = 'flyTo';
  movingOptions = {
    duration: 1000,
    easing: (t: number) => t
  };
  panToOptions = {
    duration: 500
  };
  centerWithPanTo = false;

  private map?: MapboxMap;
  selectedFeature = signal<GeoJSON.Feature | null>(null);
  popupLngLat = signal<LngLatLike | null>(null);

  constructor() {
    this.loadMoroccoPlaces();
    this.testLoad(); // Test loading GeoJSON
  }

  morocco_places = signal<GeoJSON.FeatureCollection<GeoJSON.Geometry> | null>(null);

  private async loadMoroccoPlaces() {
    try {
      const response = await import('./morocco.geo.json');
      const data = await response;
      console.log('Loaded Morocco places data:', data);
      this.morocco_places.set(data as GeoJSON.FeatureCollection<GeoJSON.Geometry>);
    } catch (error) {
      console.error('Error loading GeoJSON', error);
    }
  }

  onMapCreate(map: MapboxMap) {
    this.map = map;
    console.log('Map created', map);
  }

  async onClusterClick(evt: MapMouseEvent) {
    if (!this.map) return;
    const features = this.map.queryRenderedFeatures(evt.point, { layers: ['clusters'] });
    const clusterFeature = features[0];
    if (!clusterFeature) return;

    const clusterId = clusterFeature.properties && (clusterFeature.properties['cluster_id'] as number);
    const source = this.map.getSource('morocco_places') as any; // Fixed source ID

    if (!source || typeof source.getClusterExpansionZoom !== 'function') return;

    source.getClusterExpansionZoom(clusterId, (err: unknown, zoom: number) => {
      if (err) return;
      const coordinates = (clusterFeature.geometry as any).coordinates as [number, number];
      this.map!.easeTo({ center: coordinates, zoom });
    });
  }

  onUnclusteredPointClick(evt: MapMouseEvent) {
    const feature = evt.features && evt.features[0];
    if (!feature) return;
    this.selectedFeature.set(feature as any);
    const coordinates = (feature.geometry as any).coordinates as [number, number];
    this.popupLngLat.set(coordinates);
  }

  clearPopup() {
    this.selectedFeature.set(null);
    this.popupLngLat.set(null);
  }

  private async testLoad() {
  try {
    const data = await import('./morocco.geo.json');
    console.log('GeoJSON loaded successfully:', data.default);
    this.morocco_places.set(data.default as GeoJSON.FeatureCollection<GeoJSON.Geometry>);
  } catch (error) {
    console.error('Failed to load GeoJSON:', error);
  }
}
}
