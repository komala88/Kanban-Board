// SELECTORS
const addBtn = document.querySelector('.add-btn')
const modalCont = document.querySelector('.modal-cont')
const textArea = document.querySelector('.text-area')
const mainCont = document.querySelector('.main-cont')
const allPriorityColors = document.querySelectorAll('.priority-color')
const removeBtn = document.querySelector('.remove-btn')
const toolBoxColors = document.querySelectorAll('.color-box')
let ticketArr = JSON.parse(localStorage.getItem('tickets')) || []




// LOCAL VARIABLES
let addBtnFlag = false
let removeBtnFlag = false
let modalPriorityColor = 'lightpink'
const colors = ['lightpink', 'lightblue', 'lightgreen', 'black']
let lockOpen = "fa-lock-open";
let lockClose = "fa-lock";

//init function which runs on every refresh to fetch already created tickets from local storage
function init(){
    if(localStorage.getItem('tickets')){
        ticketArr.forEach(function(ticket){
            createTicket(ticket.id,ticket.task,ticket.ticketColor)
        })

        
    }
}
init()

//console.log(allPriorityColors) console.log(toolBoxColors)

// add button popping up modal container

addBtn.addEventListener('click', function () {
    addBtnFlag = !addBtnFlag;

    if (addBtnFlag) {
        //show modal
        modalCont.style.display = 'flex'
    }
    else {
        //close the modal pop-up
        modalCont.style.display = 'none'
    }
});

//Filtering tickets according to color
toolBoxColors.forEach(function (colorElem) {
    colorElem.addEventListener('click', function () {
        const selectedColor = colorElem.classList[0]
        //console.log(allTickets)
        //console.log(selectedColor)
        const allTickets = document.querySelectorAll('.ticket-cont')
        allTickets.forEach(function (ticket) {
            const ticketColorBand = ticket.querySelector('.ticket-color')
            //console.log(ticketColorBand);
            if (ticketColorBand.style.backgroundColor == selectedColor) {
                ticket.style.display = 'block'
            }
            else {
                ticket.style.display = 'none'
            }
        })
    })
    colorElem.addEventListener('dblclick', function () {
        const allTickets = document.querySelectorAll('.ticket-cont')
        allTickets.forEach(function (ticket) {
            ticket.style.display = 'block'
        })
    })
})


//Changing color priority on click
function handleColor(ticket) {
    const ticketColorBand = ticket.querySelector('.ticket-color')
    const id = ticket.querySelector('.ticket-id').innerText
    //console.log(ticketColorBand)
    ticketColorBand.addEventListener('click', function () {
        const currColor = ticketColorBand.style.backgroundColor
        //console.log(id)
        const ticketIdx = getIdx(id)
        //console.log(ticketIdx)
        //console.log(currColor)
        let currColorIdx = colors.findIndex(function (color) {
            return currColor === color
            
        })
        //console.log(currColorIdx)
        currColorIdx++;
        //console.log(currColorIdx)
        const newColorIdx = currColorIdx % colors.length
        const newColorBand = colors[newColorIdx]
        ticketColorBand.style.backgroundColor = newColorBand
        ticketArr[ticketIdx].ticketColor = newColorBand
        updateLocalStorage()
    })

}

//Handle Lock functionality
function handleLock(ticket) {
    const ticketLockElem = ticket.querySelector('.ticket-lock')
    const taskArea = ticket.querySelector('.task-area')
    const id = ticket.querySelector('.ticket-id').innerText
    //console.log(ticketLockElem)
    const ticketLockIcon = ticketLockElem.children[0]
    //console.log(ticketLockIcon)
    ticketLockIcon.addEventListener('click', function () {
        const ticketIdx = getIdx(id)
        //console.log(ticketIdx)
        if (ticketLockIcon.classList.contains(lockClose)) {
            ticketLockIcon.classList.remove(lockClose)
            ticketLockIcon.classList.add(lockOpen)
            taskArea.setAttribute('contenteditable', 'true')

        }
        else {
            ticketLockIcon.classList.remove(lockOpen)
            ticketLockIcon.classList.add(lockClose)
            taskArea.setAttribute('contenteditable', 'false')

        }
        ticketArr[ticketIdx].task  =taskArea.innerText
        updateLocalStorage()
    })

}

//Handle Removal
function handleRemoval(ticket) {
    ticket.addEventListener('click', function () {
        
        //console.log(id)
        //console.log(ticketIdx)
        if (removeBtnFlag){
            const id = ticket.querySelector('.ticket-id').innerText
            const ticketIdx = getIdx(id)
            ticketArr.splice(ticketIdx,1)

            ticket.remove();
            updateLocalStorage()
        }

           
            else return
    })
}
//Remove button to delete the ticket
removeBtn.addEventListener('click',function(){
    removeBtnFlag = !removeBtnFlag;
    //console.log(removeBtnFlag)
    if(removeBtnFlag == true){
        removeBtn.style.color = 'red'
        alert('delete button has been activated')
    }
        else
        removeBtn.style.color = 'white'
    
    })


//Generating a ticket

function createTicket(id, task, taskColor) {
    const ticketCont = document.createElement('div')
    ticketCont.setAttribute('class', 'ticket-cont')

    ticketCont.innerHTML =

        //`<div class="${taskColor} ticket-color"></div>
        `<div class="ticket-color" style="background-color:${taskColor}"></div>
      <div class="ticket-id">${id}</div>
    <div class="task-area">${task}</div>
    <div class="ticket-lock">
        <i class="fa-solid fa-lock"></i>
    </div>
    `
    // console.log(ticketCont )
    mainCont.appendChild(ticketCont)
    handleColor(ticketCont)
    handleLock(ticketCont)
    handleRemoval(ticketCont)

}

//Attach Key event on Modal cont(add text)

modalCont.addEventListener('keydown', function (e) {
    //let key = e.key;  
    //console.log(e)
    if (e.key == 'Shift') {
        // console.log(textArea.value)
        const task = textArea.value;
        const id = (Math.random() * 10000).toFixed(0);

        // Function Call
        createTicket(id, task,modalPriorityColor);

        modalCont.style.display = 'none'
        addBtnFlag = false

        ticketArr.push({id,task,ticketColor : modalPriorityColor})
        //console.log(ticketArr)
        updateLocalStorage()


    }
})

allPriorityColors.forEach(function (colorElem) {
    colorElem.addEventListener('click', function () {
        console.log(colorElem)
        allPriorityColors.forEach(function (prioritycolors) {
            prioritycolors.classList.remove('active');
        })

        colorElem.classList.add('active')
        modalPriorityColor = colorElem.classList[0]
        //console.log(modalPriorityColor)

    })
})

function updateLocalStorage(){
    localStorage.setItem('tickets',JSON.stringify(ticketArr))
}


//Get the Ticket Index

function getIdx(id){
    const ticketIdx = ticketArr.findIndex(function(ticket){
        return ticket.id === id //returns the id of the ticket clicked
    })
    return ticketIdx//returns the ticket index value
}




