declare namespace JKT48 {
    interface LastLive {
        d_id: number;
        paid_gift: number;
        status: boolean;
        type: string;
        url: string;
        name: string;
        image: string;
        comment: number;
        live_at: number;
        end_at: number;
        top_v: object[];
    }
    interface MemberDetail {
        sign_name: string;
        full_name: string;
        idn_url: string;
        sr_room_id: number;
        sr_room_url_key: string;
        birthday: string;
        twitter: string;
        instagram: string;
        image: string;
    }
    interface TheaterSchedule {
        show_date: number;
        show_date_str: string;
        setlist_name: string;
        member_perform: string[];
    }
    interface PremiumLive {
        entrance_url: string;
        room_url: string;
        image: string;
        premium_live_type: number;
        is_onlive: boolean;
        title: string;
        paid_live_id: number;
        room_id: number;
        room_name: string;
        start_at: number;
        setlist_img: string;
        description?: string;
        error?: boolean;
    }
}
