import { ulid } from "ulid";
import Jotting from "../types/jotting";

export class JottingFactory{

  static create(): Jotting{

    const jotting: Jotting = {
      id        : ulid(),
      gpsCoords : { lat: null, lng: null },
      supInfo   : { alt: null },
      metaData  : {
        date        : null,
        title       : null,
        description : null
      }
    };

    return jotting;
  }

  /**
 * GPS座標に関する情報を各プロパティへセットする初期化用の関数
 * @param geoPos 
 *  Geolocation APIから取得したオブジェクト
 */
  static setGPSCoords(jotting: Jotting, geoPos: GeolocationPosition){
    jotting.gpsCoords.lat  = geoPos.coords.latitude;
    jotting.gpsCoords.lng  = geoPos.coords.longitude;
    jotting.supInfo.alt    = geoPos.coords.altitude;
    jotting.metaData.date  = Date.now();
  }

}

export default JottingFactory