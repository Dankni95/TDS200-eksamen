export interface IAdvertisement {
    id: number;
    title: string;
    platform: string[];
    description: string;
    condition: string;
    maps: INewMapPoint;
    images: {
        id: string;
    };
}

export interface IAdvertisementResponse {
    images_by_id: IAdvertisement;
}

export interface IAdvertisementsResponse {
    images: IAdvertisement[];
}

export interface INewAdvertisement {
    title: string;
    description: string;
    platform: string[];
    condition: string
    images: string[];
    price: number;
    map: string;
    address: string;
}

export interface INewMapPoint {
    lon: number;
    lat: number;
    formatted: string;
    coordinates: [number, number],
    type: string,
}


