document.addEventListener('DOMContentLoaded',()=>{
    const boardSizeButtons=document.querySelectorAll('.js-board-size')
    const grid=document.querySelector('#grid')
    const flagsLeft=document.querySelector('#flags-left')
    const result=document.querySelector('#result')
    let width=8
    let hight=8
    let bombAmount=10
    let flags=0
    let squares
    let isGameOver=false
    Array.from(boardSizeButtons).forEach(button => {
        button.addEventListener('click',function(){
            while(grid.firstChild){
                grid.removeChild(grid.firstChild)
            }
            flags=0
            result.innerHTML=''
            isGameOver=false
            const x=button.getAttribute('data-size-x')
            const y=button.getAttribute('data-size-y')
            const bombs=button.getAttribute('data-size-bomb')
            if(x==0){
                createBoard()
                return
            }
            hight=x
            width=y
            bombAmount=bombs
            createBoard()
        })
    })
    function createBoard(){
        if(bombAmount==10) squares=Array(8).fill(0).map(()=>Array(8).fill(0))
        if(bombAmount==40) squares=Array(16).fill(0).map(()=>Array(16).fill(0))
        if(bombAmount==99) squares=Array(16).fill(0).map(()=>Array(32).fill(0))
        flagsLeft.innerHTML=bombAmount
        const gameArray=[]
        for(let i=0;i<hight*width;i++){
            if(i<bombAmount) gameArray.push('bomb')
            else gameArray.push('valid')
        }
        const shuffledArray=gameArray.sort(()=>Math.random()-0.5)
        let f=0
        for(let i=0;i<hight;i++){
            for(let j=0;j<width;j++){
                squares[i][j]=document.createElement('div')
                squares[i][j].setAttribute('id',f)
                squares[i][j].classList.add(shuffledArray[f])
                grid.appendChild(squares[i][j])
                f++
                squares[i][j].addEventListener('click',function(e){
                    click(squares[i][j])
                })
                squares[i][j].oncontextmenu=function(e){
                    e.preventDefault()
                    addFlag(squares[i][j])
                }
            }
        }
        grid.style.width=2.5*width+'rem'
        for(let i=0;i<hight;i++){
            for(let j=0;j<width;j++){
                if(squares[i][j].classList.contains('valid')){
                    let total=0
                    for(let k=-1;k<2;k++){
                        for(let l=-1;l<2;l++){
                            if(k!=0||l!=0){
                                if(i+k>=0&&i+k<hight&&j+l>=0&&j+l<width){
                                    if(squares[i+k][j+l].classList.contains('bomb')) total++
                                }
                            }
                        }
                    }
                    squares[i][j].setAttribute('data',total)
                }
            }
        }
    }
    createBoard()
    function addFlag(square){
        if(isGameOver) return
        if(!square.classList.contains('checked')&&(flags<bombAmount)){
            if(!square.classList.contains('flag')){
                square.classList.add('flag')
                square.innerHTML='🚩'
                flags++
                flagsLeft.innerHTML=bombAmount-flags
                checkForwin()
            }
            else{
                square.classList.remove('flag')
                square.innerHTML=''
                flags--
                flagsLeft.innerHTML=bombAmount-flags
            }
        }
    }
    function click(square){
        let currentId=square.id
        if(isGameOver) return
        if(square.classList.contains('checked')||square.classList.contains('flag')) return
        if(square.classList.contains('bomb')){
            GameOver()
            return
        }
        square.classList.add('checked')
        let total=square.getAttribute('data')
        if(total!=0){
            if(total==1) square.classList.add('one')
            if(total==2) square.classList.add('two')
            if(total==3) square.classList.add('three')
            if(total==4) square.classList.add('four')
            square.innerHTML=total
            return
        }
        checkSquare(square,currentId)
    }
    function checkSquare(square,currentId){
        let x=parseInt(currentId/hight)
        let y=currentId%width
        for(let i=-1;i<2;i++){
            for(let j=-1;j<2;j++){
                if(i!=0||j!=0){
                    if(x+i>=0&&x+i<hight&&y+j>=0&&y+j<width){
                        if(squares[x+i][y+j].classList.contains('valid')) click(squares[x+i][y+j])
                    }
                }
            }
        }
    }
    function GameOver(){
        result.innerHTML='BOOM! Game Over!'
        isGameOver=true
        for(let i=0;i<hight;i++){
            for(let j=0;j<width;j++){
                if(squares[i][j].classList.contains('bomb')){
                    squares[i][j].innerHTML='💣'
                    squares[i][j].classList.remove('bomb')
                    squares[i][j].classList.add('checked')
                }
            }
        }
    }
    function checkForwin(){
        let matches=0
        for(let i=0;i<hight;i++){
            for(let j=0;j<width;j++){
                if(squares[i][j].classList.contains('flag')&&squares[i][j].classList.contains('bomb')){
                    matches++
                    if(matches==bombAmount){
                        result.innerHTML='YOU WIN!'
                        isGameOver=true
                    }
                }
            }
        }
    }
})