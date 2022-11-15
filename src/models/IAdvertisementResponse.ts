export interface IAdvertisement {
    id: number;
    title: string;
    platform: string[];
    description: string;
    condition: string;
    maps: INewMapPoint;
    date_created: string
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

export interface ICurrentUser {
    id: string
    avatar: string
    email: string
    first_name: string
    last_name: string
}


