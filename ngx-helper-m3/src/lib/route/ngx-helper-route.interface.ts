export type NgxHelperRoute = {
    latitude: number;
    longitude: number;
}[];

export interface INgxHelperRouteConfig {
    zoom: number;
    circle: Partial<{ size: number; color: string }>;
    text: Partial<{ size: number; font: string; color: string }>;
    view: { latitude: number; longitude: number };
    disableAnimate?: boolean;
}
