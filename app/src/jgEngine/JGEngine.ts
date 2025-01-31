import Utils from "./Utils";

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

  /**
   * JavaScriptオブジェクトをJSONファイルへ変換し、指定された名前のファイルを端末へダウンロードする処理
   * @param targetData JSONファイルへ変換するJavaScriptオブジェクト
   * @param fileName 出力するJSONファイルの名前
   */
  static exportJSON(targetData: Object, fileName: string){

    // JacaScriptオブジェクトをBLOB（JSONファイル）へ変換
    const blob = new Blob([ JSON.stringify(targetData) ], { type: 'application\/json' });

    // BLOBをダウンロードするリンク（URL）を作成
    /** Warn:
     *    生成したURLはメモリ内に残存するため、解放処理を実行すること
     */
    const url = URL.createObjectURL(blob);

    // HTML aタグのクリックイベントを介してダウンロードを実行
    const anchorElm = document.createElement("a");              // aタグを生成
    anchorElm.setAttribute("href", url);                        // aタグのリンク先へ生成したURLを設定
    anchorElm.setAttribute("download", `${ fileName }.json`);   // ダウンロード実行時のファイル名を設定
    anchorElm.click();                                          // クリックイベントを発火しダウンロードを実行

    // URLをメモリから解放
    window.URL.revokeObjectURL(url);

  }

  static async importJSON(): Promise<Object>{

    // ユーザーからの入力ファイルを取得
    const file: File = await Utils.getFile();

    // ファイルを読込み（入力ファイルを文字列へと解読）
    const jsonText: string = await Utils.readTextFile(file);

    // JSON文字列からJavaScriptオブジェクトを生成
    const jsObject: Object = JSON.parse(jsonText);

    return jsObject;
  }

}

export default JGEngine