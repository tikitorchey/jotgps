import { LatLng } from "./Types";

class JGEngine{

  /**
   * 端末が位置するGPS座標（緯度経度系）を端末から取得する関数
   * 引数として関数を受け取り実行する
   * 
   * @remarks
   *  GPS座標の取得にはGeolocationAPIを利用
   * 
   * @param
   *  引数1つ返り値なしの関数.基本的にはsetterを想定している
   * 
   * @returns
   *  GPS座標を格納したオブジェクト
   */
  static getGPSCoords(func: (prm: any) => void){

    /** 
     * Memo: 素直にGPS座標を呼び出し元にreturnする処理としなかった理由
     *  GeolocationAPIがGPS座標をreturnしない仕様に合わせたため。
     *  本APIはコールバック関数内でDOMへセットするような用法が基本的である模様。
     *  汎用性を考えると、外部へreturnする方式が望ましいが、
     *  コードの複雑性と現時点での必要性を鑑みて本実装に落ち着いた。
     * 
     *  （本音のところ、コールバック対応しつつ、綺麗に外部へreturnする方法が思いつかない）
     *  （できればreturnする方式に変更したい）
     */

    const successCallback = (position: GeolocationPosition) => {
      const gpsCoords: LatLng = { lat: undefined, lng: undefined };
      gpsCoords.lat = position.coords.latitude;
      gpsCoords.lng = position.coords.longitude;
      func(gpsCoords);
    };
    
    const errorCallback = () => {
     alert("Sorry, Something Wrong...");
     console.log("Failed to get gps coords.");
    };
    
    // GeolocationAPIより現在地の座標を取得
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    
  }

}

export default JGEngine