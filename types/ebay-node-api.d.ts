declare module 'ebay-node-api' {
  export class EbayNodeApi {
    constructor(config: {
      clientID: string;
      certID: string;
      devID: string;
    });

    findCompletedItems(params: any): Promise<any>;
  }
} 