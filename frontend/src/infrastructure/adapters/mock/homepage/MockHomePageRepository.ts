import avistamientos from '../../../../../../contracts/mocks/homepage/avistamientos.json';

import { HomePageCard, IHomePagePort } from '../../../../application/ports/IHomePagePort';

export class MockHomePageRepository implements IHomePagePort {
  async getAvistamientos(): Promise<HomePageCard[]> {
    return avistamientos as HomePageCard[];
  }
}
