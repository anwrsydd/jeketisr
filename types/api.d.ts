declare namespace API {
    interface TheaterDetail {
        image: string;
        paid_live_id: number;
        room_url: string;
        title: string;
        show_date: number;
        setlist_img: string;
        description: string;
        setlist_name: string;
        member_perform: JKT48.MemberDetail[];
        error?: boolean;
    }
}
