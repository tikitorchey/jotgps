export class JSONHandler{

  constructor(){}

  /**
   * JavaScriptオブジェクトをJSONファイルへ変換し、指定された名前のファイルを端末へダウンロードするメソッド
   * @param targetData JSONファイルへ変換するJavaScriptオブジェクト
   * @param fileName 出力するJSONファイルの名前 拡張子を除いた部分とすること
   */
  static async exportJSON(targetData: Object, fileName: string): Promise<void>{

    // ブラウザのFile System API対応状況に応じて処理方式を変更（対応時の処理方式を基本とする）
    if("showSaveFilePicker" in window){   // File System API対応

      const writeBlob = async (blob: Blob, saveOptions: SaveFilePickerOptions): Promise<void> => {

        // 出力先のローカルディレクトリを選択するダイアログを表示
        const fileHandle: FileSystemFileHandle = await window.showSaveFilePicker(saveOptions);
    
        // ファイルを出力
        const fileStream: FileSystemWritableFileStream = await fileHandle.createWritable();
        await fileStream.write(blob);
        await fileStream.close();
        
      }

      // JacaScriptオブジェクトをBLOB（JSONファイル）へ変換
      const blob = new Blob([ JSON.stringify(targetData) ], { type: 'application\/json' });

      // ファイル出力時のオプションを設定
      const saveOptions: SaveFilePickerOptions = { 
        suggestedName : `${ fileName }.json`,
        types         : [ { accept : { "application/json": [ ".json" ] } } ]
      }

      await writeBlob(blob, saveOptions);

    }else{    // File System API非対応

      /** Policy: 
       *    サポート対象外のブラウザ（≒File System APIに対応していない場合）では、動作しなくてもよいこととする
       *    本処理はあくまでもサービス
       */

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
      URL.revokeObjectURL(url);

    }
  
  }

  /**
   * JSONファイルを読み込みJavaScriptオブジェクトへ変換し返すメソッド
   * @returns JavaScriptオブジェクトへ変換されたJSONデータ
   */
  static async importJSON(): Promise<Object>{

    const getFile = async (): Promise<File> => {

      const OPTIONS: OpenFilePickerOptions = {
        types: [
          {
            description : "Application Records File",
            accept      : {
              "application/json": [ ".json" ],
            },
          },
        ],
        excludeAcceptAllOption  : false,
        multiple                : false,
      };
  
      const [ fileHandle ] = await window.showOpenFilePicker(OPTIONS);    // ファイルピッカーを開く（ファイルアクセス権を取得）
      const file           = await fileHandle.getFile();                  // ファイルを取得
      return file;
      
    }

    const readTextFile = async (file: File): Promise<string> => {

      /** ToDo: 引数として渡されたファイルのバリデーションチェックの実装
       * 
       */
      const arrayBuffer : ArrayBuffer = await file.arrayBuffer();
  
      const textDecoder : TextDecoder = new TextDecoder();
      const text        : string      = textDecoder.decode(arrayBuffer);
  
      return text;
    }

    // ユーザーからの入力ファイルを取得
    const file: File = await getFile();

    // ファイルを読込み（入力ファイルを文字列へと解読）
    const jsonText: string = await readTextFile(file);

    // JSON文字列からJavaScriptオブジェクトを生成
    /** ToDo: JSONとして成立しているファイルか検証する処理を追加 */
    const jsObject: Object = JSON.parse(jsonText);

    return jsObject;

  }

}