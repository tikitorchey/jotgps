import { ulid } from "ulid";
import { JottingID, LatLng } from "../Types" 

// GPS座標のレコードおよび周辺情報を集約するクラス
export class Jotting{

  id        : JottingID;
  gpsCoords : LatLng;
  supInfo   : { alt: number | null };
  metaData  : {
    date        : Date    | undefined,    // ユーザーがメモ用に使用するフィールド（レコードの作成日時を示す用途ではない）
    title       : string  | undefined,
    description : string  | undefined
  }

  constructor(){
    this.id         = ulid();
    this.gpsCoords  = { lat: null, lng: null };
    this.supInfo    = { alt: null };
    this.metaData   = {
      date        : undefined,
      title       : undefined,
      description : undefined
    };
  }
  
}