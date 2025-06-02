export interface ISubscription {
  channelId: string;
  isSubscribed: boolean;
}

export interface ISubscriptionsState {
  subscriptions: ISubscription[];
  subscribers: string[];
  currentChannelStatus: {
    channelId: string | null;
    isSubscribed: boolean;
    subscribersCount: number;
  };
  loading: boolean;
  error: string | null;
}
