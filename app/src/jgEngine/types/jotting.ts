import { LatLng } from "./types";

// GPS座標のレコードおよび周辺情報を集約するオブジェクト
export type Jotting = {

  /** 
   *  データ永続化（ex.JSON化）時の利便性を加味して、クラスではなくtypeで実装する
   *  初期化や各種setterなどの処理は、Factoryクラスのメソッドで実行すること
   */

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
    date        : { created: number | null, updated: number | null },
    title       : string  | null,
    description : string  | null
  }

}

export default Jotting;