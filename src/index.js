// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener("DOMContentLoaded", function(event) {
  let quotesContainer = document.getElementById('quote-list')
  let form = document.getElementById('new-quote-form')
  let quoteInput = document.getElementById('new-quote')
  let authorInput = document.getElementById('author')
  let url = 'http://localhost:3000/quotes'

  fetch('http://localhost:3000/quotes').then(function(response){
    return response.json()
  }).then(function(json){
    json.forEach(function(quote) {
      quotesContainer.innerHTML +=  `<li class='quote-card' id="${quote.id}">
      <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
      <button class='btn-danger'>Delete</button>
      </blockquote>
      </li>`

    })
  })


  form.addEventListener("submit", function(event){
    event.preventDefault()
    let quote = fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accepts': 'application/json'
      },
      body: JSON.stringify({
        quote: quoteInput.value,
        likes: 0,
        author: authorInput.value
      })

    })
    quotesContainer.innerHTML +=  `<li class='quote-card' id="${quote.id}">
    <blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
    <button class='btn-danger'>Delete</button>
    </blockquote>
    </li>`
    event.target.reset()

  })

  quotesContainer.addEventListener("click", function(event){
    let id = Number(event.target.parentElement.parentElement.id)
    if (event.target.className === "btn-danger"){
      fetch(`http://localhost:3000/quotes/${id}`, {
        method: "DELETE"
      })
      event.target.parentElement.remove()
    } else if (event.target.className === "btn-success") {
      event.target.firstElementChild.innerHTML = Number(event.target.firstElementChild.innerHTML) + 1
      fetch(`http://localhost:3000/quotes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          likes: Number(event.target.firstElementChild.innerHTML)
        })
      })
    }

  })
})
