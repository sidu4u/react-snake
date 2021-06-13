import {useState,useCallback,useRef,useEffect} from "react";
import Snake from "./Snake";
import Apple from "./Apple";
import "./styles.css";

function Container(){
 const movementDelta = 10;  
 let intervalIdRef = useRef('');
 let [toggle,setToggle] = useState(false);
 const innerWidth = useRef(window.innerWidth);
 const innerHeight = useRef(window.innerHeight);
 let prevSnakeRef = useRef([{left:0,top:0}]);
 let snakeRef = useRef([{left:0,top:0}]);
 let appleRef = useRef({left:innerWidth.current/2,top:innerHeight.current/2});
 let directionRef = useRef("right");
 let snakeLengthRef = useRef(1);
 let isEatenSelfRef = useRef(false);

 const changeDirectionHandler = useCallback((event)=>{
   const direction = directionRef.current;  
   switch(event.code){
       case "ArrowDown" :
           if(direction=== 'left' || direction === 'right'){
             directionRef.current = 'down'
           }
           break;
       case "ArrowUp":    
            if(direction=== 'left' || direction === 'right'){
             directionRef.current = 'up'
            }
             break;
       case "ArrowLeft" :
            if(direction=== 'up' || direction === 'down'){
                directionRef.current = 'left'
            }
            break;
        case "ArrowRight":    
            if(direction=== 'up' || direction === 'down'){
                directionRef.current = 'right'
            }
            break;     
        default:
            break;     
   }
 },[]);

 const updateHeadPosition = useCallback(()=>{
     let snake = snakeRef.current;
     let height = innerHeight.current;
     let width = innerWidth.current;

    switch(directionRef.current){
        case "down" :
            if(snake[0].top>height){
                snake[0].top = 0;
            }
            else{
                snake[0].top+=movementDelta;
            }
            break;
        case "up": 
            if(snake[0].top<0){
                snake[0].top = height;
            }
            else{   
            snake[0].top-=movementDelta;
            }
              break;
        case "left" :
            if(snake[0].left<0){
                snake[0].left = width;
            }
            else{
                 snake[0].left-=movementDelta;
            }
             break;
         case "right":    
            if(snake[0].left>width){
                snake[0].left = 0;
            }
            else{
                snake[0].left+=movementDelta;
            }
             break;     
         default:
             break;     
    }

 },[]);

 const calculateNewSnakePosition = useCallback(()=>{
    const snakeLength = snakeLengthRef.current;
    const prevSnake = prevSnakeRef.current;
    const snake = snakeRef.current;
    while(snakeLength > snake.length){
       snake.push({left:0,top:0});
    }
     for(let i=1;i<snakeLength;i++){
        snake[i]=prevSnake[i-1];
     }
 },[]);

 const getRandomApplePosition = useCallback(()=>{
    const width = Math.ceil(innerWidth.current);
    const height = Math.floor(innerHeight.current);
    return {left:Math.floor(Math.random() * (width) + 1),top:Math.floor(Math.random() * (height) + 1)} 
 },[]);

 const checkSelfEat = useCallback(()=>{
     const snake = snakeRef.current;
     const head = snake[0];
     const leftMatch = snake.filter(ele => ele.left===head.left);
     const bitePoints = leftMatch.filter(ele => ele.top===head.top);
     
     isEatenSelfRef.current =  bitePoints.length > 1 ? true : false;
 },[]);

 const matchDimentions = useCallback(()=>{
        const snake = snakeRef.current;
        const apple = appleRef.current;
        const headLeft = snake[0].left;
        const headRight = snake[0].left+10;
        const headUp = snake[0].top;
        const headDown = snake[0].top+10;
        const appleLeft = apple.left;
        const appleRight = apple.left+10;
        const appleUp = apple.top;
        const appleDown = apple.top+10;

        if(headRight<appleLeft||headDown<appleUp||headLeft>appleRight||headUp>appleDown){
            return false
        }
        return true;
 },[]);

 const checkAppleEat = useCallback(()=>{
     const apple = appleRef.current;
     const snakeLength = snakeLengthRef.current;
     if(!matchDimentions()){
         return;
     }
     const newApplePosition = getRandomApplePosition();
     apple.left = newApplePosition.left;
     apple.top = newApplePosition.top;
     snakeLengthRef.current = snakeLength+1;
 },[getRandomApplePosition,matchDimentions]);


 useEffect(()=>{
    intervalIdRef.current = setInterval( 
        () => {
          prevSnakeRef.current = snakeRef.current.map(element=>({...element}));  
          updateHeadPosition();
          checkSelfEat();
          if(isEatenSelfRef.current && intervalIdRef.current ){
            clearInterval(intervalIdRef.current);
            return;
          }  
          checkAppleEat();
          calculateNewSnakePosition();
          setToggle(toggle=>!toggle);
       },
           50
      );
      window.addEventListener('keydown',changeDirectionHandler);
 },[updateHeadPosition,calculateNewSnakePosition,checkAppleEat,checkSelfEat,changeDirectionHandler]);



  return (<div className="container">
    <Snake data={snakeRef.current}/>
    <Apple data={appleRef.current}/>
  </div>);
}

export default Container;