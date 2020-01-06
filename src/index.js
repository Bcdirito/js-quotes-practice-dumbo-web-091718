let quoteList = document.getElementById("quote-list")
const newQuoteForm = document.getElementById("new-quote-form")

const QUOTE_URL = "http://localhost:3000/quotes"
const globalHeaders = {
  "Content-Type": "application/json",
  "Acces": "application/json"
}

const getAllQuotes = () => {
  fetch(QUOTE_URL)
  .then(res => res.json())
  .then(json => {
    json.forEach(quoteObj => {
      quoteList.innerHTML += generateQuoteCard(quoteObj)
    })
  })
}

const generateQuoteCard = ({quote, likes, author, id} = obj) => {
  return `<li class='quote-card' data-id="${id}">
            <blockquote class="blockquote">
              <p class="mb-0">${quote}</p>
              <footer class="blockquote-footer">${author}</footer>
              <br>
              <button class='btn-success' data-id="${id}" data-likes="${likes}">Likes: <span>${likes}</span></button>
              <button class='btn-danger' data-id="${id}">Delete</button>
            </blockquote>
          </li>`
}

const updateDB = (url, optionsObj) => {
  fetch(url, optionsObj)
  .then(res => res.json())
  .then(json => {
    if (optionsObj.method === "POST") quoteList.innerHTML += generateQuoteCard(json)
    else if (optionsObj.method === "PATCH") updateQuoteCard(json)
    else deleteQuoteCard(url[url.length - 1])
  })
}

const updateQuoteCard = (json) => {
  Array.from(quoteList.children).forEach(quote => {
    if (Number(quote.dataset.id) === json.id) {
      quote.innerHTML = generateQuoteCard(json)
    }
  }) 
}

const deleteQuoteCard = (checkID) => {
  Array.from(quoteList.children).forEach(quote => {
    if (quote.dataset.id === checkID) {
      quote.remove()
    }
  })
}


newQuoteForm.addEventListener("submit", (e) => {
  e.preventDefault()

  updateDB(QUOTE_URL, {
    method: "POST",
    headers: globalHeaders,
    body: JSON.stringify({
      quote: e.target.children[0].children[1].value,
      author: e.target.children[1].children[1].value,
      likes: 0
    })
  })

  e.target.reset()
})

quoteList.addEventListener("click", (e) => {
  if (e.target.className === "btn-success") {
    updateDB(`${QUOTE_URL}/${e.target.dataset.id}`, {
      method: "PATCH",
      headers: globalHeaders,
      body: JSON.stringify({likes: Number(e.target.dataset.likes) + 1})
    })
  } else if (e.target.className === "btn-danger") {
    updateDB(`${QUOTE_URL}/${e.target.dataset.id}`, {
      method: "DELETE", 
      headers: globalHeaders
    })
  }
})

getAllQuotes()