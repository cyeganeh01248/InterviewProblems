import type { NextFunction } from 'express';
import * as http from 'node:http';

export class APIResponse {
    constructor(msg: string, data: any = null) {
        this.msg = msg;
        this.data = data;
    }
    msg: string;
    data: any;
}

export class User {
    id: number;
    created_at: Date;
    email: string;
    role: string;
    session?: string;
    constructor(id: number, created_at: Date, email: string, role: string) {
        this.id = id;
        this.created_at = created_at;
        this.email = email;
        this.role = role;
    }
}
