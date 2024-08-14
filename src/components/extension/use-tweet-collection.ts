import type { XConfig } from "@src/hooks/useCardStore";
import { create } from "zustand";

interface TweetCollection {
    isActivated: boolean;
    setIsActivated: (isActivated: boolean) => void;
    imageSrc?: string;
    setImageSrc: (imageSrc: string) => void;
    activeTab: string,
    setActiveTab: (tabValue: string) => void;
    tweets: XConfig[];
    setTweets: (tweets: XConfig[]) => void;
    getTweets: () => XConfig[];
    addTweet: (tweet: XConfig | XConfig[]) => void;
    removeTweet: (tweet: XConfig) => void;
    updateTweet: (tweet: XConfig) => void;
    moveTweet: (from: number, to: number) => void;
    resetTweets: () => void;
    // const [showCodeDialog, setShowCodeDialog] = useState(false);
    showCodeDialog: boolean;
    setShowCodeDialog: (showCodeDialog: boolean) => void;


}

export const useTweetsStore = create<TweetCollection>(
    (set, get) => ({
        showCodeDialog: false,
        setShowCodeDialog: (showCodeDialog: boolean) => {
            set({
                showCodeDialog
            })
        },
        isActivated: false,
        setIsActivated: (isActivated: boolean) => {
            set({
                isActivated
            })
        },
        imageSrc: '',
        setImageSrc: (imageSrc: string) => {
            set({
                imageSrc
            })
        },
        activeTab: 'single',
        setActiveTab: (tabValue: string) => {
            set({
                activeTab: tabValue
            })
        },
        tweets: [],
        setTweets: (tweets: XConfig[]) => {
            set({
                tweets
            })
        },
        getTweets: () => {
            return get().tweets;
        },
        addTweet: (tweet) => {
            set((state) => ({
                tweets: state.tweets.concat(tweet)
            }))
        },
        removeTweet: (tweet: XConfig) => {
            set((state) => ({
                tweets: state.tweets.filter((t) => t.id !== tweet.id)
            }))
        },
        updateTweet: (tweet: XConfig) => {
            set((state) => ({
                tweets: state.tweets.map((t) => t.id === tweet.id ? tweet : t)
            }))
        },
        moveTweet: (from: number, to: number) => {
            set((state) => {
                const tweets = [...state.tweets];
                const [removed] = tweets.splice(from, 1);
                tweets.splice(to, 0, removed);
                return {
                    tweets
                }
            })
        },
        resetTweets: () => {
            set((state) => ({
                tweets: []
            }))
        },
    })
);

