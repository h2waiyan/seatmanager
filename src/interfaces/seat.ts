export interface SeatManager {
    userid: string;

    seat_id: any;
    seat_no_array: any;
    trip_id: string;
    sub_route_id: string;
    seat_status: number;

    car_type: string;

    front_seat_price: number;
    back_seat_price: number;

    original_price: number;
    ref_price: number;
    seat_and_status: any;

    customer_name: string;
    total_price: number;
    discount: number;
    phone: string;
    gender: number;
    pickup_place: string;
    remark: string;

    seat_isdeleted: string;
    date_time: string;
}

export interface GetSeat {
    userid: string;
    trip_id: string;
}

export interface GetSeatHistory {
    userid: string;
    trip_id: string;
}