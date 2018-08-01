import {getConnection} from './connect';
import { Fin } from 'hadouken-js-adapter';

// TODO - Change client/service file structure to allow importing these values
export interface WindowIdentity {
    uuid: string;
    name: string;
}

const getClientConnection = async () => {
    const fin:Fin = await getConnection();
    return fin.Service.connect({uuid: 'Layouts-Manager'});
};

export async function undockWindow(identity: WindowIdentity) {
    const client = await getClientConnection();
    await client.dispatch('undock', identity);
}
