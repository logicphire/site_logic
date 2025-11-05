import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    login(email: string, password: string): Promise<{
        token: string;
        user: {
            id: number;
            email: string;
            nome: string;
            role: string;
        };
    }>;
    register(email: string, password: string, nome: string): Promise<{
        token: string;
        user: {
            id: number;
            email: string;
            nome: string;
            role: string;
        };
    }>;
    validateToken(token: string): Promise<{
        valid: boolean;
    }>;
}
