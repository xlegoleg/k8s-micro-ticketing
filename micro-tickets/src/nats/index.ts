import { NatsClientWrapper } from '@xlegoleg/ticketing-common';

export interface INatsConnectionParams {
  clusterId: string,
  clientId: string,
  url: string,
}

export const nats = new NatsClientWrapper();

export const connectNatsClient = async ({
  clusterId,
  clientId,
  url,
}: INatsConnectionParams) => {
  await nats.connect(clusterId, clientId, url);
  nats.client.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });
  process.on('SIGINT', () => nats.client.close());
  process.on('SIGTERM', () => nats.client.close());
};