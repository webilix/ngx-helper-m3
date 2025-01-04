import { Component, HostBinding, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import { Feature, Map, View } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { Point } from 'ol/geom';
import interactionDoubleClickZoom from 'ol/interaction/DoubleClickZoom';
import BaseLayer from 'ol/layer/Base';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';

import { MatIcon } from '@angular/material/icon';

import { Helper } from '@webilix/helper-library';

import { INgxHelperCoordinates, INgxHelperCoordinatesConfig } from '../ngx-helper-coordinates.interface';

@Component({
    host: { selector: 'get' },
    imports: [FormsModule, NgxMaskDirective, MatIcon],
    providers: [provideNgxMask()],
    templateUrl: './get.component.html',
    styleUrl: './get.component.scss',
})
export class GetComponent implements OnInit {
    @HostBinding('className') private className: string = 'ngx-helper-m3-coordinates';

    public coordinates?: INgxHelperCoordinates;
    public config?: Partial<INgxHelperCoordinatesConfig>;
    public close!: (coordinates?: INgxHelperCoordinates) => void;

    private map!: Map;
    public coordinate: Coordinate = [];
    public inputTransformFn = (value: any): string => Helper.STRING.changeNumbers(value.toString(), 'EN');

    ngOnInit(): void {
        this.coordinate = this.coordinates
            ? [this.coordinates.longitude, this.coordinates.latitude]
            : this.config?.view
            ? [this.config.view.longitude, this.config.view.latitude]
            : [51.3380603, 35.6997382];

        const zoom: number = this.config?.zoom || 15;

        this.map = new Map({
            view: new View({ center: this.coordinate, zoom, projection: 'EPSG:4326' }),
            layers: [new TileLayer({ source: new OSM() })],
            target: 'ngx-helper-m3-coordinates-map',
        });

        this.map
            .getInteractions()
            .getArray()
            .forEach((interaction) => {
                if (interaction instanceof interactionDoubleClickZoom) this.map.removeInteraction(interaction);
            });

        this.addLayer();
    }

    addLayer(): void {
        this.map
            .getLayers()
            .getArray()
            .forEach((layer: BaseLayer) => {
                if (layer instanceof VectorLayer) this.map.removeLayer(layer);
            });

        if (this.coordinates) {
            const size: number = this.config?.size || 8;
            const color: string = this.config?.color || 'rgb(42, 101, 126)';

            const point = new Point(this.coordinate);
            const layer = new VectorLayer({
                source: new VectorSource({ features: [new Feature(point)] }),
                style: {
                    'circle-fill-color': color,
                    'circle-radius': size,
                    'circle-stroke-color': '#FFF',
                    'circle-stroke-width': 1,
                },
            });
            this.map.addLayer(layer);
        }
    }

    checkInputs(latitude: string, longitude: string): void {
        this.coordinates = undefined;
        this.addLayer();

        latitude = latitude.toString().trim();
        if (latitude === '' || isNaN(+latitude) || +latitude < -180 || +latitude > 180) return;

        longitude = longitude.toString().trim();
        if (longitude === '' || isNaN(+longitude) || +longitude < -180 || +longitude > 180) return;

        const center: Coordinate = [+longitude, +latitude];
        this.map.getView().animate({ center, duration: 1000 });

        this.coordinate = [+longitude, +latitude];
        this.coordinates = { latitude: +latitude, longitude: +longitude };
        this.addLayer();
    }

    selectCoordinates(): void {
        if (!this.coordinates) return;
        this.close(this.coordinates);
    }

    setCoordinates(event: MouseEvent): void {
        event.preventDefault();

        this.coordinate = this.map.getEventCoordinate(event).map((c: number) => +c.toFixed(7));
        this.coordinates = { latitude: this.coordinate[1], longitude: this.coordinate[0] };
        this.addLayer();
    }
}
