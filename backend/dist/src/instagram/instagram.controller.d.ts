import { InstagramService, InstagramMedia } from './instagram.service';
export declare class InstagramController {
    private readonly instagramService;
    constructor(instagramService: InstagramService);
    getPosts(limit?: string): Promise<InstagramMedia[]>;
}
