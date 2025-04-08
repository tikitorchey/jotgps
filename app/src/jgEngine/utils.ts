/**
 * 汎用メソッドを一時的に集約するクラス
 * 本クラスは実運用されるプログラム内での使用を避けること
 * 基本は開発用途、特に一時的なものに限定する
 */
export class Utils{

  constructor(){ }

  /**
   * ファイルピッカーを表示し、ユーザーが選択したファイルを呼び出し元に返すメソッド
   * @returns ユーザーが選択したファイル
   */
  static async getFile(): Promise<File> {

    /** Ref:
     *    引用元: https://developer.mozilla.org/ja/docs/Web/API/File_System_API
     */

    const [ fileHandle ] = await window.showOpenFilePicker();   // ファイルピッカーを開く（ファイルアクセス権を取得）
    const file           = await fileHandle.getFile();          // ファイルを取得
    return file;
    
  }

  /**
   * 
   * @param file 
   * @returns 
   */
  static async readTextFile(file: File): Promise<string>{

    /** ToDo: 引数として渡されたファイルのバリデーションチェックの実装
     * 
     */
    const arrayBuffer : ArrayBuffer = await file.arrayBuffer();

    const textDecoder : TextDecoder = new TextDecoder();
    const text        : string      = textDecoder.decode(arrayBuffer);

    return text;
  }

  /**
   *  ローカル端末へファイル（Blobデータ）を保存するメソッド
   * @param blob ファイル
   * @param saveOptions ファイル出力先ディレクトリを設定するダイアログへ設定するオプション
   *  - suggestedName  : 出力ファイル名のプレイスホルダー
      - types          : 出力ファイルとして許容する拡張子
   */
  static async writeBlob(blob: Blob, saveOptions: SaveFilePickerOptions): Promise<void>{

    // 出力先のローカルディレクトリを選択するダイアログを表示
    const fileHandle: FileSystemFileHandle = await window.showSaveFilePicker(saveOptions);

    // ファイルを出力
    const fileStream: FileSystemWritableFileStream = await fileHandle.createWritable();
    await fileStream.write(blob);
    await fileStream.close();
    
  }

}

export default Utils;