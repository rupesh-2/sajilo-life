
import { networkService } from '../../../services/network/networkService';

export const isConnected = () => networkService.checkConnection();
