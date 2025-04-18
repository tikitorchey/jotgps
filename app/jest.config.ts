import type {Config} from 'jest';
import {defaults} from 'jest-config';

/** 
 * Memo: testEnviromentをjsdom指定している理由
 *  本プロジェクトではnavigationオブジェクトに実装されているGeolocationAPIをはじめとする、
 *  グローバルオブジェクトを参照する場面が存在する。
 *  その際にnode環境ではこれらのグローバルオブジェクトが実装されていないため、jsdomを選択している
 * ToDo: 可能であればnode環境に変更
 *  node環境においてもグローバルオブジェクトを利用する方法を特定できた場合は、切り替えること
 *  node環境のほうがテスト実行速度がはやいと言われている
 */
const config: Config = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
  testEnvironment: "jsdom",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
};

export default config;