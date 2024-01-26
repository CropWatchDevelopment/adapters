import { IDatabaseStructure } from "../../../interfaces/DatabaseStructure.interface";

export const getPackageConfiguration = (): IDatabaseStructure => {
    console.log('HIHIHI I AM THE TMEPNPK ADAPTER');

    let struct: IDatabaseStructure = {
        Temperature: 1,
        Humidity: 2,
    }

    return struct;
}