let formElement = document.querySelector("#infoForm")
let nameInputElement = document.querySelector("#nameInput")
let requestContainerElement = document.querySelector("#requestContainer")
let progressContainerElement = document.querySelector("#progressContainer")
let completeContainerElement = document.querySelector("#completeContainer")
let submitButtonElement = document.querySelector("#submitBtn")
let typeSelectElement = document.querySelector("#typeSelect")
let descriptionInputElement = document.querySelector("#description")
let priorityElement = document.querySelector("#priorityElement")
let sortElement = document.querySelector("#sortElement")
let counter = 0;
let dataCollection = []

submitButtonElement.addEventListener("click", (e) => {
    e.preventDefault()
    formElement.reportValidity()
    let cardData = {
        id: counter,
        name: nameInputElement.value,
        description: descriptionInputElement.value,
        type: typeSelectElement.value,
        priority: priorityElement.value,
        status: "request",
        set state(status) {
            this.status = status || "request"
        }
    }
    counter++;
    formElement.checkValidity() && dataCollection.push(cardData) && sortElement.value ? sort() : createCard(cardData);
})

//creating card
let createCard = (data) => {
    let cardContainer = document.createElement("div")
    let heading = document.createElement("h1")
    let description = document.createElement("p")
    let descriptionText = document.createTextNode(data.description)
    let leftButton = document.createElement("button")
    let rightButton = document.createElement("button")
    cardContainer.dataset.id = data.id;//passing id to card to keep track of card
    heading.innerHTML = data.name;
    description.appendChild(descriptionText)
    leftButton.innerHTML = "<"
    rightButton.innerHTML = ">"
    cardContainer.classList.add("card")

    //adding click event to navigation buttons
    leftButton.addEventListener("click", (e) => {
        let id = e.target.parentElement.dataset.id
        let index
        dataCollection.map((value, ind) => {
            if (value.id === +id) {
                index = ind
            }
        })
        dataCollection[index].status = "request"
        sortElement.value ? sort() : renderCard(e.target.parentNode)
    })

    rightButton.addEventListener("click", (e) => {
        let id = e.target.parentElement.dataset.id
        let index
        dataCollection.map((value, ind) => {
            if (value.id === +id) {
                index = ind
            }
        })
        let item = dataCollection[index]
        switch (item.status) {
            case "request": {
                dataCollection[index].state = "progress"
                sortElement.value ? sort() : renderCard(e.target.parentNode)
                break;
            }
            case "progress": {
                dataCollection[index].state = "complete"
                sortElement.value ? sort() : renderCard(e.target.parentNode)
                break;
            }
        }
    })
    cardContainer.append(heading, description, leftButton, rightButton)
    addType(cardContainer, data.type)
    renderCard(cardContainer)
}

//adding card to respective containers
let renderCard = (card) => {
    let id = card.dataset.id
    let status

    //checking id in dataCollection and id in card
    dataCollection.map(value => {
        if (+id === value.id) {
            status = value.status
        }
    })

    detach(card)
    switch (status) {
        case "request": {
            card.childNodes[2].style.display = "none"
            requestContainerElement.appendChild(card)
            break;
        }
        case "progress": {
            card.childNodes[2].style.display = "inline"
            card.childNodes[3].style.display = "inline"
            progressContainerElement.appendChild(card)
            break;
        }
        case "complete": {
            card.childNodes[2].style.display = "none"
            card.childNodes[3].style.display = "none"
            completeContainerElement.appendChild(card)
            break;
        }
    }
}

//sorting cards,removing unsorted cards from containers and adding sorted cards 
function sort() {
    if (sortElement.value === "Low to high priority") {
        requestContainerElement.innerHTML = ''
        progressContainerElement.innerHTML = ''
        completeContainerElement.innerHTML = ''
        dataCollection.sort((a, b) => {
            return a.priority - b.priority
        })
        dataCollection.map(value => createCard(value))

    } else if (sortElement.value === "High to low priority") {
        requestContainerElement.innerHTML = ''
        progressContainerElement.innerHTML = ''
        completeContainerElement.innerHTML = ''
        dataCollection.sort((a, b) => {
            return b.priority - a.priority
        })
        dataCollection.map(value => createCard(value))
    }
}

sortElement.addEventListener("input", sort)

//to remove single card from container 
function detach(node) {
    return node.parentElement?.removeChild(node);
}

//adding side strip colors according to type
function addType(card, type) {
    switch (type) {
        case "Feature": {
            card.style.setProperty("--color", "green")
            break;
        }
        case "Bug": {
            card.style.setProperty("--color", "red")
            break;
        }
        case "Enhancement": {
            card.style.setProperty("--color", "rgb(340, 81, 10)")
            break;
        }
    }
}
