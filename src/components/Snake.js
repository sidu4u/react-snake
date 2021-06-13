import "./styles.css";
import {useCallback} from "react";

function Snake({data={}}){

const createStyle = useCallback((ele)=>({
    left:`${ele.left}px`,
    top:`${ele.top}px`
}),[])    


console.log('snake',data);
 return (<>
     {data.map((element,index)=>{
         const style = createStyle(element);
         return <div key={index} className="snake-body" style={style}></div>
     })}
 </>);
};

export default Snake;