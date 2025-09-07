export interface IUser {
    _id: string;
    name: string;
    mail: string;
    role: {
        _id: string,
        name: string,
    };
    permissions?: {
        _id: string,
        name: string,
        apiPath: string,
        module: string
    }[]
}