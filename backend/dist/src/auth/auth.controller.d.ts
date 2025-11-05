import { AuthService } from './auth.service';
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: {
            id: number;
            email: string;
            nome: string;
            role: string;
        };
    }>;
    validate(body: {
        token: string;
    }): Promise<{
        valid: boolean;
    }>;
}
