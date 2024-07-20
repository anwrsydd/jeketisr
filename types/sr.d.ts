declare namespace SR {
    interface User {
        name: string;
        image: string;
    }

    interface RecommendComment {
        created_at: number;
        comment: string;
        user: User;
    }

    interface SNS {
        icon: string;
        url: string;
        name: string;
    }

    interface ECConfig {
        sales_available: number;
        is_external_ec: number;
        links: any[];
    }

    interface SHOWROOMProfile {
        prev_league_id: number | null;
        image_list: any[];
        banner_list: any[] | null;
        is_talk_online: boolean;
        award_list: any[] | null;
        push_send_status: Record<string, any>;
        performer_name: string;
        follower_num: number;
        live_continuous_days: number;
        next_league_id: number | null;
        live_id: number;
        league_id: number;
        is_official: boolean;
        is_follow: boolean;
        voice_list: any[];
        stella_list: any[];
        show_rank_subdivided: string;
        event: any | null;
        is_birthday: boolean;
        description: string;
        live_tags: any[];
        genre_id: number;
        displayed_medals: any[];
        prev_score: number;
        youtube_id: string;
        visit_count: number;
        recommend_comment_list: RecommendComment[];
        current_live_started_at: number;
        next_show_rank_subdivided: string;
        share_text_live: string;
        badge_list: any[];
        sns_list: SNS[];
        recommend_comments_url: string;
        share_url: string;
        room_url_key: string;
        league_label: string;
        is_live_tag_campaign_opened: boolean;
        avatar: string | null;
        share_url_live: string;
        prev_show_rank_subdivided: string;
        is_talk_opened: boolean;
        image_square: string;
        recommend_comment_post_url: string;
        room_name: string;
        genre_name: string;
        birthday: number;
        room_level: number;
        party_live_status: number;
        party: Record<string, any>;
        ec_config: ECConfig;
        image: string;
        recommend_comment_open_status: number;
        main_name: string;
        view_num: number;
        has_more_recommend_comment: boolean;
        is_party_enabled: boolean;
        premium_room_type: number;
        next_score: number;
        is_onlive: boolean;
        room_id: number;
    }
}
