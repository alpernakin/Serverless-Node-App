export interface Environment {
    mysql: MySQL;
}

export interface MySQL {
    host: string;
    database: string;
    port: number;
    user: string;
    password: string;
}