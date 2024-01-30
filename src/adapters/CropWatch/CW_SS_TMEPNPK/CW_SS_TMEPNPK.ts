import { IAdapter } from "../../../interfaces/Adapter.interface";
import { IDatabaseStructure } from "../../../interfaces/DatabaseStructure.interface";

export function getPackageConfiguration(): IDatabaseStructure {
    console.log('HIHIHI I AM THE TMEPNPK ADAPTER');

    let struct: IDatabaseStructure = {
        Temperature: 1,
        Humidity: 2,
    };

    return struct;
}

export function modifyMessage(message: any) {
    console.log(message);
    // MODIFY HERE!

    let output = message;
    return output;
}