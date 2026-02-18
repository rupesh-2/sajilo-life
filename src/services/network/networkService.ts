
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

class NetworkService {
    isOnline = true;

    constructor() {
        NetInfo.addEventListener((state: NetInfoState) => {
            this.isOnline = state.isConnected ?? false;
        });
    }

    async checkConnection(): Promise<boolean> {
        const state = await NetInfo.fetch();
        return state.isConnected ?? false;
    }
}

export const networkService = new NetworkService();
