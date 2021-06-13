import "./styles.css";
import {useCallback} from "react";

function Snake({data={}}){

const createStyle = useCallback(()=>({
    left:`${data.left}px`,
    top:`${data.top}px`
}),[data]);    



 return (<div className="apple" style={createStyle()}>
          </div>
        );
};

export default Snake;