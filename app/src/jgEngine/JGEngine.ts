import { LatLng } from "./Types";

export class JGEngine{

  /**
   * 端末が位置するGPS座標（緯度経度系）を端末から取得する関数
   * 
   * @remarks
   *  GPS座標の取得にはGeolocationAPIを利用
   * 
   * @returns
   *  [ToDo: 追記]
   */
  static getGPSCoords(): Promise<GeolocationPosition>{

    // GeolocationAPIより現在地の座標を取得
    return new Promise( (successCallback, errorCallback) => {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } );
    
  }

}

export default JGEngine