export type SocketSessionEntity = {
  userID: string;
  username: string;
  connected: boolean;
}

/* abstract */ class SocketSessionStore {
    findSession(id: string) {}
    saveSession(id:string, session: SocketSessionEntity) {}
    findAllSessions() {}
  }
  
  const SESSION_TTL = 24 * 60 * 60;

  import { GetTableEntityResponse, TableClient, TableEntityResult } from "@azure/data-tables";
  
  const mapSession = (session: GetTableEntityResponse<TableEntityResult<Record<string, unknown>>>) => {
    if(session.timestamp) {
      const ts: any = new Date(session.timestamp);
      const now: any = new Date();
      const diffSeconds = (now - ts)/1000;
      if (diffSeconds >= SESSION_TTL) {
        return undefined;
      }
    }
    return {
      userID: session.userID, 
      username: session.username,
      connected: session.connected
    };
  };

  const mapCatchSession = (e: any) => {
    if (e.statusCode === 404) {
        return undefined;
    }
  }

  class AzureTableSocketSessionStore extends SocketSessionStore {
    azureTableClient: TableClient;
    constructor(azureTableClient: TableClient) {
      super();
      this.azureTableClient = azureTableClient;
    }
  
    findSession(id: string) {
      return this.azureTableClient
        .getEntity(`session:${id}`,`session:${id}`)
        .then(mapSession)
        .catch(mapCatchSession);
    }
  
    saveSession(id: string, session: SocketSessionEntity) {
      return this.azureTableClient
        .createEntity({
          partitionKey:`session:${id}`,
          rowKey: `session:${id}`,
          ...session,
        });
    }
  
    async findAllSessions() {
      const entities = this.azureTableClient.listEntities();
      // this loop will get all the entities from all the pages
      // returned by the service
      const sessions = [];
      for await (const entity of entities) {
        sessions.push(entity);
      }
      return sessions;
    }
  }
  module.exports = {
    AzureTableSocketSessionStore
  };