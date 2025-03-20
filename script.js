const cardDiv = document.getElementById('card')

const set = start => {
  let balance = JSON.parse(start)

  const inputDiv = document.getElementById('start')
  const headDiv = document.getElementById('head')
  const msgDiv = document.getElementById('msg')

  inputDiv.classList.add('dn')
  cardDiv.parentNode.classList.remove('dn')
  headDiv.innerHTML = `Seu saldo: ${balance} pontos`
  msgDiv.innerHTML = `Clique na carta para revelar a sua sorte!`

  let time = 0
  let index = 0
  const chances = [
    [-.1,-.1,-.15,-.15,.1,.1,.1,.15,'next','next'],		      //40% de chance de perder
    [-.25,-.25,-.25,-.35,-.35,.25,.25,.35,'next','next'],		//50% de chance de perder
    [-.5,-.5,-.5,-.5,-.5,-.6,.5,.5,.6,'next'],		          //60% de chance de perder
    [-1,-1,-1,-1,-1,-1,-1,-1,1,1]	                          //80% de chance de perder
  ]
  const play = index => {
    if(balance<=0){
      inputDiv.value = 0
      inputDiv.classList.remove('dn')
      cardDiv.parentNode.classList.add('dn')
      headDiv.innerHTML = `Desculpe, você está sem saldo.\nInsira um novo saldo para continuar jogando :)`
      return
    }
    const roll = Math.floor(Math.random()*10) //0 to 9
    if(chances[index][roll]==='next') play(index+1)
    else{
      time++
      const deposit = Math.ceil(balance * chances[index][roll]*100)/100
      balance = Math.ceil((balance + deposit)*100)/100

      let text = deposit>0
        ? `<p>Parabéns, você <span class="green">ganhou</span> ${deposit} pontos!`
        : `<p>Desculpe, você <span class="red">perdeu</span> ${Math.abs(deposit)} pontos!`
      text += ` Seu novo saldo é de ${balance} pontos.</p>`
      const great = (index===3&&chances[index][roll]>0)?'great':null

      const card = create_card(index,text,great)
      cardDiv.appendChild(card)

      msgDiv.innerHTML = `Você jogou ${time} vez${time>1?'es':''}.\nDesta vez você atingiu o nível ${index} de prêmio.`
      headDiv.innerHTML = `Seu saldo: ${balance} pontos`

      index = 0
      return balance
    }
  }
  return () => play(index)
}
let start = null
const go = (val) => start = set(val)

const create_card = (lvl,text,great) => {
  cardDiv.setAttribute('onclick','')
  const card = document.createElement("div")
  card.setAttribute('onclick','delete_card(this)')
  card.setAttribute('class','card')
  card.innerHTML = `
    <div class='card-inner'>
      <div class='card-back'></div>
      <div class='card-front lvl${lvl}'></div>
    </div>`;
  
  const card_info = `
    <div class='deck lvl${lvl}'>
      <div class='info'>${text}</div>
    </div>
    <div class='spark ${great?'':'dn'}'></div>
    <div class='holo ${great?'':'dn'}'></div>
    `

  card.children[0].children[1].innerHTML = card_info;

  setTimeout(() => {
    card.children[0].children[0].style.transform = "rotateY(180deg)";
    card.children[0].children[1].style.transform = "rotateY(0deg)";
    card.children[0].children[1].classList.add(great);
  },100);

  return card
}

const delete_card = card => {
  const signx = Math.floor(Math.random()*2)?-1:1
  const signy = Math.floor(Math.random()*2)?-1:1

  const posx = signx*Math.floor(Math.random()*100)+signy*300
  const posy = signy*Math.floor(Math.random()*100)+signx*300

  card.style.transform = `translate(${posx}%,${posy}%)`
  card.style.opacity = `0`

  setTimeout(() => {
    card.remove()
    cardDiv.setAttribute('onclick','start()')
  },500);
}