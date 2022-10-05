export interface TripInterface {
    userid: string;
    trip_id: string;

    gate_id : string;
    date : Array<string>;
    route_id : Array<string>;
    car_type_id : Array<string>;
    seat_and_status: string;

    car_id : string;
    total_price : string;
    remark : string;
    trip_isdeleted: string;
}

export interface GetTripInterface {
    userid : string;
    gate_id : string;
    date : string;
    route_id : string;
}