window.addEventListener("DOMContentLoaded", (e) => {
  const quotesURL = "http://localhost:3000/quotes"
  const quotesList = document.getElementById("quote-list")
  const form = document.getElementById("new-quote-form")

  const globalHeaders = {
    "Content-Type": "application/json",
    "Access": "application/json"
  }

  const getQuotes = () => {
    fetch(quotesURL)
    .then(res => res.json())
    .then(json => json.forEach(quote => {
      populateArea(quotesList, quote)
    })
    )
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault()
    postQuote(e.target.newQuote.value, e.target.newAuthor.value)
    e.target.newQuote.value = ""
    e.target.newAuthor.value = ""
  })

  quotesList.addEventListener("click", (e) => {
    if (e.target.className === "btn-danger") deleteQuote(e.target.parentElement.dataset.id)
    else if (e.target.className === "btn-success") likeQuote(e.target.parentElement.dataset.id, Number(e.target.innerText.split(" ")[1]))
  })

  const populateArea = (area, item) => {
    area.innerHTML += `<li class='quote-card'>
    <blockquote class="blockquote" data-id=${item.id}>
      <p class="mb-0">${item.quote}</p>
      <footer class="blockquote-footer">${item.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${item.likes}</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
  </li>`
  }

  const findArea = (id, callback, data) => {
    Array.from(quotesList.children).forEach(item => {
      if (item.firstElementChild.dataset.id === String(id)) {
        callback(item, data)
      }
    })
  }

  const updateArea = (area, item) => {
    area.innerHTML = `<li class='quote-card'>
    <blockquote class="blockquote" data-id=${item.id}>
      <p class="mb-0">${item.quote}</p>
      <footer class="blockquote-footer">${item.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${item.likes}</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
  </li>`
  }

  const deleteArea = (area) => {
    area.remove()
  }

  const postQuote = (qte, auth) => {
    fetch(quotesURL, {
      method: "POST",
      headers: globalHeaders, 
      body: JSON.stringify({
        quote: qte,
        likes: 0,
        author: auth
      })
    })
    .then(res => res.json())
    .then(json => populateArea(quotesList, json))
  }

  const likeQuote = (id, likeNum) => {
    likeNum += 1
    fetch(`${quotesURL}/${id}`, {
      method: "PATCH",
      headers: globalHeaders,
      body: JSON.stringify({
        likes: likeNum
      })
    })
    .then(res => res.json())
    .then(json => {
      findArea(json.id, updateArea, json)
    })
  }

  const deleteQuote = (id) => {
    fetch(`${quotesURL}/${id}`, {
      method: "DELETE",
      headers: globalHeaders
    })
    .then(res => res.json())
    .then(json => findArea(id, deleteArea, ""))
  }

  getQuotes()
})