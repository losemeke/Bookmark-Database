let addResearchButtonItemButton = document.getElementById(`add-button`)
let modalOverlay = document.getElementById(`modal-overlay-container`)
let resourceNameInput = document.getElementById(`resource-name`)
let closeIcon = document.getElementById(`xmark`)
let form = document.getElementById(`form`)
let resourceLinkInput = document.getElementById(`resource-link`)
let resourceDescriptionInput = document.getElementById(`resource-description`)
let contentContainerDiv = document.getElementById(`content-container`)

addResearchButtonItemButton.addEventListener(`click`, revealModalOverlay)
function revealModalOverlay(){
    // use classList to switch the class from hidden to the visible one
    modalOverlay.classList.remove(`modal-overlay-container`)
    modalOverlay.classList.add(`modal-overlay-container-visible`)
    // whenever the form is visible, we want the focus to be on the first input field or activate focus on that input 
    resourceNameInput.focus()
}

closeIcon.addEventListener(`click`, closeModalOverlay)
function closeModalOverlay(){
    // reverse of above function but first confirm that its visible aka does it contain the visible classname? this makes sure the icon ONLY works on this condition
    if(modalOverlay.classList.contains(`modal-overlay-container-visible`)){
        modalOverlay.classList.remove(`modal-overlay-container-visible`)
        modalOverlay.classList.add(`modal-overlay-container`)
    }    
}


// COLLECT FORM DATA AND SEND TO LOCAL STORAGE
let dataArray = []
// when a submit button is clicked on a form, the submit event is activated
form.addEventListener(`submit`, processFormData)
function processFormData(event){
    // first remove the default behaviour of forms that empties everything its holding, refereshing itself. 
    event.preventDefault()
    // now collect the data individually, store in an object literal, push into an array then send to local storage
    let resourceName = resourceNameInput.value
    let resourceLink = resourceLinkInput.value
    let resourceDescription = resourceDescriptionInput.value

   const collectedData = {
        resNAME : resourceName,
        resLINK : resourceLink,
        resDESCRIPTION : resourceDescription
    }


    // to send to storage, put all the literals in an array as arrays can be used to loop over and fetch data. Create the empty array then push the literals into it   
    dataArray.push(collectedData) 
    localStorage.setItem(`researchItems`, JSON.stringify(dataArray))
    // now reset form
    form.reset()
    // and close the overlay after submission
    closeModalOverlay()

    printReasearchItems()
    
}


// RETRIEVE DATA FROM LOCAL STORAGE
function fetchResearchItems(){
    // function to check if it exists aka can we get reserachItems from local storage
    if(localStorage.getItem(`researchItems`)){
        // it does so get it from LS using JSON.parse and save in the array created to send it to storage
        dataArray = JSON.parse(localStorage.getItem(`researchItems`))
    }
    printReasearchItems()
}
fetchResearchItems() // to activate function


// PRINT RETRIEVED DATA ON THE UI
function printReasearchItems(){
    contentContainerDiv.innerHTML = ` `
    dataArray.forEach((item)=>{
        let UIresName = item.resNAME
        let UIresLink = item.resLINK
        let UIresDescription = item.resDESCRIPTION

        // now create the container that will store these data (the commented on in content-container)
        let cardContainerDiv = document.createElement(`div`)  
        cardContainerDiv.classList.add(`card-container`)

        let titleDeleteContainerDiv = document.createElement(`div`)
        titleDeleteContainerDiv.classList.add(`card-title-and-delete-icon-container`)

        let researchItemTitle = document.createElement(`a`)
        researchItemTitle.setAttribute(`href`, `${UIresLink}`)
        researchItemTitle.setAttribute(`target`, `_blank`)
        researchItemTitle.textContent = UIresName

        let deleteIcon = document.createElement(`i`)
        deleteIcon.classList.add(`fa-solid`, `fa-trash`)
        deleteIcon.setAttribute(`onclick`, `deleteItem('${UIresLink}')`)

        let cardDescriptionDiv = document.createElement(`div`)
        cardDescriptionDiv.classList.add(`card-description`)

        let descriptionText = document.createElement(`p`)
        descriptionText.textContent = UIresDescription

        // Now append a and i to its container, p to its container, then append both parent containers to the grand container thats content-container. Order is important
        titleDeleteContainerDiv.append(researchItemTitle, deleteIcon)
        cardDescriptionDiv.append(descriptionText)

        cardContainerDiv.append(titleDeleteContainerDiv, cardDescriptionDiv)
        contentContainerDiv.append(cardContainerDiv)
    })    
}
// now we call this function in the fetch function so that as its being fetched, its printing on the ui

function deleteItem(researchLink){
    dataArray.forEach((item,index)=>{
        if(item.resLINK === researchLink){
            dataArray.splice(index, 1)
        }
    })
    localStorage.setItem(`researchItems`, JSON.stringify(dataArray))
    fetchResearchItems()
}