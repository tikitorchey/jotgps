import { ulid } from "ulid";
import { LatLng } from "../types";

// GPS座標のレコードおよび周辺情報を集約するクラス
export class Jotting{

  /**
   * id :
   *  - Jottingを一意に識別するための識別番号
   *  - ULID形式を使用する
   * gpsCoords:
   *  - GPS座標
   *  - 緯度/経度（Latitude/Longittude）形式を用いる
   * supInfo:
   *  - 補足情報（Supplemental Information）を保持するオブジェクト
   * metadate:
   *  - ユーザーが任意に設定できるメモ情報を保持するオブジェクト 
   *  date:
   *    - 基本的にはGPS座標のレコードを記録した日時。例外的にユーザーが任意の用途で設定してもよい
   *    - エポックミリ秒を使用する
   *  title:
   *    - Jottingのタイトル。ラベルや一言メモのような用途で使用する想定
   *  description:
   *    - Jottingの詳細説明。ユーザーが自由記述欄として自由に使用してもよい
   */
  id        : string;
  gpsCoords : LatLng;
  supInfo   : { alt: number | null };
  metaData  : {
    date        : number  | null,
    title       : string  | null,
    description : string  | null
  }

  /** Attention:
   *  コンストラクター呼び出し時には、各種プロパティにデータをセットしないこと
   *  初期化の際は、本クラスのinitialize関数を用いること
   */
  constructor(){
    this.id         = ulid();
    this.gpsCoords  = { lat: null, lng: null };
    this.supInfo    = { alt: null };
    this.metaData   = {
      date        : null,
      title       : null,
      description : null
    };
  }

  /**
   * GPS座標に関する情報を各プロパティへセットする初期化用の関数
   * @param geoPos 
   *  Geolocation APIから取得したオブジェクト
   */
  initialize(geoPos: GeolocationPosition){
    this.gpsCoords.lat  = geoPos.coords.latitude;
    this.gpsCoords.lng  = geoPos.coords.longitude;
    this.supInfo.alt    = geoPos.coords.altitude;
    this.metaData.date  = Date.now();
  }
  
}

export default Jotting;