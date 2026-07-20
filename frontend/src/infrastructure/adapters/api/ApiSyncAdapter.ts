import { ISyncService } from '../../../application/ports/ISyncService';
import { SyncDatabaseChangeSet } from '@nozbe/watermelondb/sync';

export class ApiSyncAdapter implements ISyncService {
  constructor(
    private readonly apiUrl: string,
    private readonly getToken: () => Promise<string | null>
  ) {}

  async pullChanges(lastPulledAt: number | null): Promise<{ changes: SyncDatabaseChangeSet; timestamp: number }> {
    const token = await this.getToken();
    const queryParam = lastPulledAt ? `?last_pulled_at=${lastPulledAt}` : '';
    
    const response = await fetch(`${this.apiUrl}/sync/pull${queryParam}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Pull failed: ${response.status} ${errorData.error || response.statusText}`);
    }

    return await response.json();
  }

  async pushChanges(changes: SyncDatabaseChangeSet, lastPulledAt: number): Promise<void> {
    const token = await this.getToken();
    
    const response = await fetch(`${this.apiUrl}/sync/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(changes)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Push failed: ${response.status} ${errorData.error || response.statusText}`);
    }
  }
}
