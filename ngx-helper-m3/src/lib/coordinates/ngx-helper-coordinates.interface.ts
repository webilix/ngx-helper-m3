export interface INgxHelperCoordinates {
    latitude: number;
    longitude: number;
}

export interface INgxHelperCoordinatesConfig {
    zoom: number;
    size: number;
    color: string;
    view: INgxHelperCoordinates;
}
