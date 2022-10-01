export interface CarType {
    userid: string;
    car_type_id : string;
    car_type_name : string;
    no_of_seats: number;
    remark : string;
    car_type_isdeleted : boolean;
}

export interface GetCarType {
    userid: string;
    car_type_id : string;
}

