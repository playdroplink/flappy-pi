
import { secureAuthService } from './secureAuthService';

// Legacy wrapper for backward compatibility
class PiAuthService {
  async authenticateWithPi() {
    return secureAuthService.authenticateWithPi();
  }

  async signOut() {
    return secureAuthService.signOut();
  }

  async validateSession() {
    return secureAuthService.validateSession();
  }
}

export const piAuthService = new PiAuthService();
