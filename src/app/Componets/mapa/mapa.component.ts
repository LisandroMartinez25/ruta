/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, HostListener, Renderer2 } from '@angular/core';
@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit, AfterViewInit {

  @ViewChild('map', {static: false}) mapElement: any;
  @ViewChild('origen', {static: false}) origenElement: ElementRef;
  @ViewChild('destino', {static: false}) destinoElement: ElementRef;

  public map: google.maps.Map;
  public lat: number;
  public lng: number;
  public zoom: number;
  public originPlaceId: string;
  public destinationPlaceId: string;
  public marker: google.maps.Marker;
  public autocompleteOri: google.maps.places.Autocomplete;
  public autocompleteDest: google.maps.places.Autocomplete;
  public directionsService: google.maps.DirectionsService;
  public directionsRenderer: google.maps.DirectionsRenderer;

  constructor(
    private render: Renderer2
  ) {
    this.lat = 19.4299053;
    this.lng = -99.131591;
    this.zoom = 13;
    this.originPlaceId = null;
    this.destinationPlaceId = null;
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    const coordinates = {
      lat: this.lat,
      lng: this.lng
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: coordinates,
      zoom: 13,
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: true,
      fullscreenControl: true
    });

    this.marker = new google.maps.Marker({
      map: this.map,
      anchorPoint: new google.maps.Point(this.lat, this.lng)
    });
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(this.map);

    this.autocompleteOri = new google.maps.places.Autocomplete(this.origenElement.nativeElement);
    this.autocompleteOri.addListener('place_changed', (e) => {
      const placeOr = this.autocompleteOri.getPlace();
      this.originPlaceId = placeOr.place_id;
    });

    this.autocompleteDest = new google.maps.places.Autocomplete(this.destinoElement.nativeElement);
    this.autocompleteDest.addListener('place_changed', () => {
      const placeDest = this.autocompleteDest.getPlace();
      this.destinationPlaceId = placeDest.place_id;
    });
  }

  orignKeypress(event: any) {
    if (event.target.value.length >= 3) {
      
    } else {
      this.autocompleteOri = null;
      const time = setTimeout(() => {
        this.autocompleteOri = new google.maps.places.Autocomplete(this.origenElement.nativeElement);
        const ev = new KeyboardEvent('keydown', {
          key: 'ArrowRight',
          ctrlKey: true,
          shiftKey: true
        });
        this.render.selectRootElement(this.origenElement.nativeElement).dispatchEvent(ev);
        clearTimeout(time);
      }, 3000);
    }
  }

  destinoKeypress(event: any) {
    if (event.target.value.length >= 3) {
      
    } else {
      this.autocompleteDest = null;
      const time = setTimeout(() => {
        this.autocompleteDest = new google.maps.places.Autocomplete(this.destinoElement.nativeElement);
        const ev = new KeyboardEvent('keydown', {
          key: 'ArrowRight',
          ctrlKey: true,
          shiftKey: true
        });
        this.render.selectRootElement(this.destinoElement.nativeElement).dispatchEvent(ev);
        clearTimeout(time);
      }, 3000);
    }
  }

  buscar(): void {
    const travelMode = google.maps.TravelMode.DRIVING;

    this.directionsService.route(
      {
        origin: {placeId: this.originPlaceId},
        destination: {placeId: this.destinationPlaceId},
        travelMode
      },
      (response, status) => {
        if (status === 'OK') {
          this.directionsRenderer.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
  }

}
