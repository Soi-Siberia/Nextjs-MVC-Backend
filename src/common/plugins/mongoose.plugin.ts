import { Connection } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

export function applyGlobalPlugins(connection: Connection): Connection {
    connection.plugin(mongooseDelete, {
        deletedAt: true,
        overrideMethods: true,
    });
    return connection;
}