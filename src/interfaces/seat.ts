export interface SeatManager {
    userid: string;

    seat_id : string;
    seat_no_array : string;
    trip_id: string;
    sub_route_id : string;
    seat_status : string;

    customer_name : string;
    total_price : number;
    discount : number;
    phone: string;
    gender : string;
    pickup_place :string;
    remark : string;
    
    seat_isdeleted: string;
}

export interface GetSeat {
    userid: string;
    trip_id : string;
}