// testattu ja toimii
const dummy = (blogs) => {
  return 1
}

// testattu ja toimii
const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

// testattu ja toimii
const favoriteBlog = (blogs) => {
  const favorite = {
    title: '',
    author: '',
    likes: 0
  }

  const reducer = (favorite, item) => {
    if (item.likes >= favorite.likes) {
      return { title: item.title, author:item.author, likes:item.likes }
    } else {
      return favorite
    }
  }
  return blogs.length === 0
    ? {}
    : blogs.reduce(reducer, favorite)
}

// testattu ja toimii
const mostBlogs = (blogs) => {

  const reducer = (list, item) => {
    const index = list.findIndex(x => x.author === item.author)
    if (index > -1) {
      list[index].blogs +=1
      return list
    } else {
      list.push({ author: item.author, blogs: 1 })
      return list
    }
  }

  const reducer2 = (most, item) => {
    if (Object.entries(most).length === 0|| item.blogs > most.blogs) {
      return item
    } else {
      return most
    }
  }

  return blogs.length === 0
    ? {}
    : blogs.reduce(reducer, []).reduce(reducer2, {}) // eka käydään lista läpi ja tehää {author, blogs}, sen jälkeen katotaan kenellä eniten blogeja
}
const mostLikes = (blogs) => {

  const reducer = (list, item) => {
    const index = list.findIndex(x => x.author === item.author)
    if (index > -1) {
      list[index].likes += item.likes
      return list
    } else {
      list.push({ author: item.author, likes: item.likes })
      return list
    }
  }

  const reducer2 = (most, item) => {
    if (Object.entries(most).length === 0|| item.likes > most.likes) { // tyhjän objectin tarkistuksen olisi voinut tehdä Lodash kirjastolla
      return item
    } else {
      return most
    }
  }

  return blogs.length === 0
    ? {}
    : blogs.reduce(reducer, []).reduce(reducer2, {}) // eka käydään lista läpi ja tehää {author, blogs}, sen jälkeen katotaan kenellä eniten blogeja
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}