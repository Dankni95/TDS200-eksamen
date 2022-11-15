export interface IAdvertisement {
    id: number;
    title: string;
    platform: string[];
    description: string;
    price: number;
    condition: string;
    maps: INewMapPoint;
    address: string;
    date_created: string;
    user_created: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    }
    images: {
        directus_files_id: {
            id: string;
        };
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
    coordinates: [number, number];
    type: string;
}

export interface ICurrentUser {
    id: string
    avatar: string
    email: string
    first_name: string
    last_name: string
}


