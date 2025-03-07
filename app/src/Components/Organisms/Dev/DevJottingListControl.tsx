import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, Typography, CardActions, Grid2 } from "@mui/material";
import { LibraryAdd, AddCircleOutline, RemoveCircleOutline, DeleteForever } from "@mui/icons-material";
import { JGEngine } from "../../../jgEngine/jgEngine";
import { Jotting } from "../../../jgEngine/models/jotting";

/**
 * Outline	: XXXするComponent
 * Logic		: - AAAをBBBにする
 *            - 親ComponentからCCCを受け取り、DDDとしたものを子Componentに渡す
 * View			: - KKKをリスト表示する
 */

// Type Declaration of Props
type Props = {
  jottingList   : Array<Jotting>;
  setJottingList: (jottingList: Array<Jotting>) => void;
}

export const DevJottingListControl: React.FC<Props> = ({ jottingList, setJottingList }) => {

  // ___ state ___ ___ ___ ___ ___
  const [ sampleState, setSampleState ] = useState<string>('This is SampleState');

  // ___ use effect ___ ___ ___ ___ ___
  useEffect( () => { console.log(sampleState) }, [ sampleState ] );

  // ___ event handler ___ ___ ___ ___ ___
  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSampleState(newValue);
  };

  // ___ method ___ ___ ___ ___ ___
  const test = () => {
    console.log('test');
  }

  const onClickAddButton = async () => {

    const jotting: Jotting = new Jotting();

    // GPS座標を取得・セット
    const geoPos: GeolocationPosition = await JGEngine.getGPSCoords();
    jotting.initialize(geoPos);

    /** Memo: structuredClone関数によりオブジェクトを複製する理由
     *    Reactはオブジェクト内部の変更を検出できない。
     *    そこで、オブジェクト自体を複製することでオブジェクトIDを変えることで変更を検出させている
     */
    const clonedList = structuredClone(jottingList);
    clonedList.push(jotting);

    setJottingList(clonedList);

  }

  const onClickClearButton = () => {
    const clearedList: Array<Jotting> = [];
    setJottingList(clearedList);
  }

  const onClickRemoveButton = () => {

      /** Memo: structuredClone関数によりオブジェクトを複製する理由
     *    Reactはオブジェクト内部の変更を検出できない。
     *    そこで、オブジェクト自体を複製することでオブジェクトIDを変えることで変更を検出させている
     */
      const clonedList = structuredClone(jottingList);
      clonedList.pop();
  
      setJottingList(clonedList);
  }

  return (

    <Card variant = "outlined"  sx = {{ height: "100%" }}>

      <CardContent>
        <Typography variant = "h5" component = "div">
          <LibraryAdd /> Control Records Loaded on The UI
        </Typography>
        <Typography variant = "body2" sx = {{ color: 'text.secondary' }}>
          Add / Remove / Clear Jottings loaded on The UI.
        </Typography>
      </CardContent>

      <CardActions sx = {{ display: "flex", justifyContent: "flex-end" }}>
        <Button size = "small" onClick = { onClickClearButton }>    <DeleteForever />         </Button>
        <Button size = "small" onClick = { onClickRemoveButton } >  <RemoveCircleOutline />   </Button>
        <Button size = "small" onClick = { onClickAddButton } >     <AddCircleOutline  />     </Button>
      </CardActions>

    </Card>

  );
};

export default DevJottingListControl