import nats, { Stan } from "node-nats-streaming";

export class NatsClientWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('Cannot access Nats before connecting');
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((res, rej) => {
      this.client.on('connect', () => {
        console.log(`Nats streaming connected - ${clusterId}/${clientId}`);
        res();
      });
  
      this.client.on('error', (e) => {
        console.log(`An error occurred while connecting to Nats streaming - ${clusterId}/${clientId}`, e);
        rej(e);
      });
    })
  }
}