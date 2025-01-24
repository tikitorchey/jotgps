import { LatLng } from "./Types";

class JGEngine{

  /**
   * 端末が位置するGPS座標（緯度経度系）を端末から取得する関数
   * 
   * @remarks
   *  GPS座標の取得にはGeolocationAPIを利用
   * 
   * @returns
   *  GPS座標を格納したオブジェクト
   */
  static getGPSCoords(): LatLng{

    /**
     * GeolocationAPIより現在地の座標を取得
     */

    const latLng: LatLng = {
      lat: 179.123456,
      lng: 0.123456
    }

    return latLng;
  }

}

export default JGEngine