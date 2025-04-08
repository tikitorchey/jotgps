import Utils from "./utils";
import IDBHandler from "./dataPerpetuations/iDBHandler";
import Jotting from "./types/jotting";
import { StoreName } from "./dataPerpetuations/iDBSchema";
import { JSONHandler } from "./dataPerpetuations/jsonHandler";

const IDB_STORENAME_JOTTING: StoreName = "jotting";
const MSG_NAV_GEOAPI_UNSUPPORTED_JPN: string = "ご利用のブラウザはGPS座標の所得に対応していない可能性があります。";

export class JGEngine{

  /**
   * 端末のGPS座標（緯度経度系）を取得する関数
   * 座標取得に成功/失敗時に各コールバックを実行する
   * 
   * @remarks
   *  GPS座標の取得にはGeolocationAPIを利用
   *  GeolocationAPIの利用はsecure origins(https://goo.gl/Y0ZkNV)からの呼び出しが必要となる
   *  例えばhttps通信やlocalhostでの接続がこれに該当する
   * 
   */
  static getGPSCoords(successCallback: PositionCallback, errorCallback?: PositionErrorCallback): void{

    // ブラウザのGeoAPI対応可否の確認
    if("geolocation" in navigator){

      // 呼び出し元からエラーコールバックが設定されていない場合は、汎用のエラーハンドリングを設定する
      if(!errorCallback){
        const generalErrorCallback = (error: GeolocationPositionError) => {
          console.debug(error);
        }
        errorCallback = generalErrorCallback;
      }

      // GeolocationAPIより現在地の座標を取得
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

    }else{
      alert(MSG_NAV_GEOAPI_UNSUPPORTED_JPN);
    }
    
  }

  /**
   * JavaScriptオブジェクトをJSONファイルへ変換し、指定された名前のファイルを端末へダウンロードするメソッド
   * @param targetData JSONファイルへ変換するJavaScriptオブジェクト
   * @param fileName 出力するJSONファイルの名前 拡張子を除いた部分とすること
   */
  static async exportJottings(targetData: Object, fileName: string): Promise<void>{

    try{

      await JSONHandler.exportJSON(targetData, fileName);

    } catch (e) {

      /** Memo: Errorの種類
       * AbortError ... ユーザーがファイル選択をキャンセルした際に発生するエラー
       */
      if ( (e instanceof Error) && (e.name === 'AbortError')) {
        throw e;
      } else {
        throw e;
      }

    }

  }

  /**
   * JSONファイルを読み込みJottingのリストへ復元するメソッド
   * @returns JSONから復元されたJottingのリスト
   */
  static async importJottings(): Promise<Array<Jotting>>{

    try{

      const jsObject          = await JSONHandler.importJSON();
      const importedJottings  = jsObject as Array<Jotting>;

      /** Todo:
       *    フォーマットのチェック処理を追加
       */

      return importedJottings;

    } catch (e) {

      /** Memo: Errorの種類
       * AbortError ... ユーザーがファイル選択をキャンセルした際に発生するエラー
       */
      if ( (e instanceof Error) && (e.name === 'AbortError')) {
        throw e;
      } else {
        throw e;
      }

    }

  }

  static iDBCreateJottings(jottingToSave: Array<Jotting>){
    IDBHandler.createRecords(IDB_STORENAME_JOTTING, jottingToSave);
  }

  static iDBReadAllJottings(func: (data: any) => void){
    const successCallback = (data: any) => {
      func(data);
    }
    IDBHandler.readAllRecords(IDB_STORENAME_JOTTING, successCallback);
  }

  static iDBReadTargetJottings(tardetKeys: Array<string>, func: (data: any) => void){
    const successCallback = (data: any) => {
      func(data);
    }
    IDBHandler.readTargetRecordsByKey(IDB_STORENAME_JOTTING, tardetKeys, successCallback);
  }

}

export default JGEngine