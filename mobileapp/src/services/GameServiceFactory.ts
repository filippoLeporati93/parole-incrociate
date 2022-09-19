import gameServiceComputer from "./GameServiceComputer";
import gameServiceOnline from "./GameServiceOnline";

export type IPlayMatrix = Array<Array<string>>;


const gameServiceFactory = () => {

    const build = (isOnlineGame: boolean)  => {
        switch (isOnlineGame) {
            case true:
                return gameServiceOnline();
            case false:
                return gameServiceComputer();
            default:
                return gameServiceComputer();
        }
    }

    return {
        build
    }
}

export default gameServiceFactory