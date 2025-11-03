export interface InstagramMedia {
    id: string;
    caption?: string;
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    media_url: string;
    permalink: string;
    thumbnail_url?: string;
    timestamp: string;
}
export declare class InstagramService {
    private readonly accessToken;
    private readonly userId;
    private readonly baseUrl;
    constructor();
    getRecentPosts(limit?: number): Promise<InstagramMedia[]>;
    refreshAccessToken(longLivedToken: string): Promise<any>;
    private getMockPosts;
}
